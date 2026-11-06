import { goaOpen, isGoaOpen } from "../internal/attributes";
import { findGoaHosts, Locator, TextMatch } from "../internal/locate";
import { normalizeText } from "../internal/text";

/**
 * Finds a goa-app-header-menu by its `heading`. Yields the host; its links are
 * light-DOM children.
 *
 * @param {Locator} locator - Menu heading, or a locator object.
 */
export function getGoaAppHeaderMenu(locator: Locator): Cypress.Chainable<JQuery<HTMLElement>> {
  return findGoaHosts("goa-app-header-menu", locator, "text", (el) => normalizeText(el.getAttribute("heading")));
}

/**
 * Opens a goa-app-header-menu. Does nothing if it is already open.
 *
 * @param {Locator} locator - Menu heading, or a locator object.
 */
export function openGoaAppHeaderMenu(locator: Locator): void {
  const popover = () => getGoaAppHeaderMenu(locator).shadow().find("goa-popover");
  popover().then(($popover) => {
    if (!isGoaOpen($popover)) {
      cy.wrap($popover, { log: false }).find('button[slot="target"]').click();
    }
  });
  popover().should(goaOpen());
}

/**
 * Opens a goa-app-header-menu and clicks one of its links by text.
 *
 * @param {Locator} locator - Menu heading, or a locator object.
 * @param {string | RegExp} linkText - The link text.
 * @example
 * selectGoaAppHeaderMenu("Reports", "Monthly report");
 */
export function selectGoaAppHeaderMenu(locator: Locator, linkText: TextMatch): void {
  openGoaAppHeaderMenu(locator);
  getGoaAppHeaderMenu(locator).contains("a", linkText).click();
}
