import { findGoaHosts, Locator } from "../internal/locate";
import { normalizeText } from "../internal/text";

/**
 * Finds a goa-callout by its `heading`. Yields the host; its `type` attribute is
 * information, important, emergency, success or event, and its body is light DOM.
 *
 * @param {Locator} [locator] - Callout heading, or a locator object.
 * @example
 * getGoaCallout("Important callout").should("have.attr", "type", "important").and("contain.text", "body");
 */
export function getGoaCallout(locator?: Locator): Cypress.Chainable<JQuery<HTMLElement>> {
  return findGoaHosts("goa-callout", locator, "text", (el) => normalizeText(el.getAttribute("heading")));
}
