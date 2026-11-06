import { clickShadowControl } from "../internal/actions";
import { findGoaHosts, Locator } from "../internal/locate";
import { normalizeText } from "../internal/text";

/**
 * Finds a goa-work-side-menu. Yields the host; its items and groups are light-DOM
 * children.
 *
 * @param {Locator} [locator] - Extra selector or a locator object.
 */
export function getGoaWorkSideMenu(locator?: Locator): Cypress.Chainable<JQuery<HTMLElement>> {
  return findGoaHosts("goa-work-side-menu", locator, "none");
}

function setMenuOpen(locator: Locator | undefined, open: boolean): void {
  const root = () => getGoaWorkSideMenu(locator).shadow().find(".root");
  root().then(($root) => {
    if ($root.hasClass("closed") === open) {
      getGoaWorkSideMenu(locator).shadow().find('[data-testid="toggle-menu"]').click({ force: true });
    }
  });
  root().should(open ? "not.have.class" : "have.class", "closed");
}

/**
 * Expands a collapsed goa-work-side-menu (icons only) to its full width, so item
 * labels and groups become visible. Does nothing if it is already expanded.
 *
 * @param {Locator} [locator] - Which menu, when there are several.
 */
export function openGoaWorkSideMenu(locator?: Locator): void {
  setMenuOpen(locator, true);
}

/**
 * Collapses a goa-work-side-menu to icons only. Does nothing if already collapsed.
 *
 * @param {Locator} [locator] - Which menu, when there are several.
 */
export function closeGoaWorkSideMenu(locator?: Locator): void {
  setMenuOpen(locator, false);
}

/**
 * Finds a goa-work-side-menu-item by its `label`. Yields the shadow menu item
 * (an `a` or `button` with `role="menuitem"`).
 *
 * @param {Locator} locator - Item label, or a locator object.
 * @example
 * getGoaWorkSideMenuItem("Alerts").should("have.attr", "href", "/alerts");
 */
export function getGoaWorkSideMenuItem(locator: Locator): Cypress.Chainable<JQuery<HTMLElement>> {
  return findGoaHosts("goa-work-side-menu-item", locator, "text", (el) => normalizeText(el.getAttribute("label")))
    .shadow()
    .find('[role="menuitem"]');
}

/**
 * Clicks a goa-work-side-menu-item by its label. Items inside a collapsed group are
 * hidden; open the group first.
 *
 * @param {Locator} locator - Item label, or a locator object.
 * @example
 * clickGoaWorkSideMenuItem("Alerts");
 */
export function clickGoaWorkSideMenuItem(locator: Locator): void {
  clickShadowControl(getGoaWorkSideMenuItem(locator));
}

/**
 * Finds a goa-work-side-menu-group by its `heading`. Yields the host.
 *
 * @param {Locator} locator - Group heading, or a locator object.
 */
export function getGoaWorkSideMenuGroup(locator: Locator): Cypress.Chainable<JQuery<HTMLElement>> {
  return findGoaHosts("goa-work-side-menu-group", locator, "text", (el) => normalizeText(el.getAttribute("heading")));
}

function setGroupOpen(locator: Locator, open: boolean): void {
  const summary = () => getGoaWorkSideMenuGroup(locator).shadow().find("summary");
  summary().then(($summary) => {
    if (($summary.attr("aria-expanded") === "true") !== open) {
      cy.wrap($summary, { log: false }).click();
    }
  });
  summary().should("have.attr", "aria-expanded", String(open));
}

/**
 * Expands a goa-work-side-menu-group. Does nothing if it is already open.
 *
 * @param {Locator} locator - Group heading, or a locator object.
 * @example
 * openGoaWorkSideMenuGroup("Files");
 * clickGoaWorkSideMenuItem("Assigned");
 */
export function openGoaWorkSideMenuGroup(locator: Locator): void {
  setGroupOpen(locator, true);
}

/**
 * Collapses a goa-work-side-menu-group. Does nothing if it is already collapsed.
 *
 * @param {Locator} locator - Group heading, or a locator object.
 */
export function closeGoaWorkSideMenuGroup(locator: Locator): void {
  setGroupOpen(locator, false);
}
