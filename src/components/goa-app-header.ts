import { findGoaHosts, Locator, TextMatch } from "../internal/locate";

/**
 * Finds a goa-app-header. Yields the host; its navigation links and buttons are
 * light-DOM children, so `.within()` works.
 *
 * @param {Locator} [locator] - Extra selector or a locator object.
 * @example
 * getGoaAppHeader().should("have.attr", "heading", "Case Management");
 */
export function getGoaAppHeader(locator?: Locator): Cypress.Chainable<JQuery<HTMLElement>> {
  return findGoaHosts("goa-app-header", locator, "none");
}

/**
 * Clicks a navigation link (an `<a>` in the light DOM) of a goa-app-header by its text.
 *
 * @param {string | RegExp} linkText - The link text.
 * @param {Locator} [locator] - Which header, when there are several.
 * @example
 * clickGoaAppHeader("Cases");
 */
export function clickGoaAppHeader(linkText: TextMatch, locator?: Locator): void {
  getGoaAppHeader(locator).contains("a", linkText).click();
}
