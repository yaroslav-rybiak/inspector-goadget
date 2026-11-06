import { findGoaHosts, Locator } from "../internal/locate";

/**
 * Finds a goa-link by its visible text. Yields the goa-link host; the anchor it wraps
 * is a light-DOM child, so `.find("a")` reaches it.
 *
 * @param {Locator} locator - Link text, or a locator object.
 * @example
 * getGoaLink("Terms of use").find("a").should("have.attr", "href", "/terms");
 */
export function getGoaLink(locator: Locator): Cypress.Chainable<JQuery<HTMLElement>> {
  return findGoaHosts("goa-link", locator, "text");
}

/**
 * Clicks the anchor inside a goa-link.
 *
 * @param {Locator} locator - Link text, or a locator object.
 * @example
 * clickGoaLink("Terms of use");
 */
export function clickGoaLink(locator: Locator): void {
  getGoaLink(locator).find("a").click();
}
