import { findGoaHosts, Locator, requireOneGoaHost, TextMatch } from "../internal/locate";
import { normalizeText } from "../internal/text";

/**
 * Finds a goa-side-menu. Yields the host; its links, headings and groups are
 * light-DOM children.
 *
 * @param {Locator} [locator] - Extra selector or a locator object.
 */
export function getGoaSideMenu(locator?: Locator): Cypress.Chainable<JQuery<HTMLElement>> {
  return findGoaHosts("goa-side-menu", locator, "none");
}

/**
 * Clicks a link (an `<a>` in the light DOM) of a goa-side-menu by its text. Links
 * inside a collapsed goa-side-menu-group are hidden; open the group first.
 *
 * @param {string | RegExp} linkText - The link text.
 * @param {Locator} [locator] - Which side menu, when there are several.
 * @example
 * clickGoaSideMenu("Dashboard");
 */
export function clickGoaSideMenu(linkText: TextMatch, locator?: Locator): void {
  requireOneGoaHost("clickGoaSideMenu", "goa-side-menu", locator, "none");
  getGoaSideMenu(locator).contains("a", linkText).click();
}

/**
 * Finds a goa-side-menu-group by its `heading`. Yields the host.
 *
 * @param {Locator} locator - Group heading, or a locator object.
 */
export function getGoaSideMenuGroup(locator: Locator): Cypress.Chainable<JQuery<HTMLElement>> {
  return findGoaHosts("goa-side-menu-group", locator, "text", (el) => normalizeText(el.getAttribute("heading")));
}

function setGroupOpen(locator: Locator, open: boolean): void {
  const group = () => getGoaSideMenuGroup(locator).shadow().find('[data-testid="group"]');
  group().then(($group) => {
    if ($group.hasClass("hidden") === open) {
      getGoaSideMenuGroup(locator).shadow().find("a.heading").click();
    }
  });
  group().should(open ? "not.have.class" : "have.class", "hidden");
}

/**
 * Expands a goa-side-menu-group so its links become visible. Does nothing if open.
 *
 * @param {Locator} locator - Group heading, or a locator object.
 * @example
 * openGoaSideMenuGroup("Cases");
 * clickGoaSideMenu("Open cases");
 */
export function openGoaSideMenuGroup(locator: Locator): void {
  requireOneGoaHost("openGoaSideMenuGroup", "goa-side-menu-group", locator, "text", (el) => normalizeText(el.getAttribute("heading")));
  setGroupOpen(locator, true);
}

/**
 * Collapses a goa-side-menu-group. Does nothing if it is already collapsed.
 *
 * @param {Locator} locator - Group heading, or a locator object.
 */
export function closeGoaSideMenuGroup(locator: Locator): void {
  requireOneGoaHost("closeGoaSideMenuGroup", "goa-side-menu-group", locator, "text", (el) => normalizeText(el.getAttribute("heading")));
  setGroupOpen(locator, false);
}
