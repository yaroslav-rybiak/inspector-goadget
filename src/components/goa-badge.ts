import { attributeOrSlotText, findGoaHosts, Locator } from "../internal/locate";

/**
 * Finds a goa-badge by its content (`content` attribute or `slot="content"`). Yields the
 * host; `type` is its colour variant.
 *
 * @param {Locator} [locator] - Badge content, or a locator object such as `{ selector: '[type="success"]' }`.
 * @example
 * getGoaBadge("Approved").should("have.attr", "type", "success");
 */
export function getGoaBadge(locator?: Locator): Cypress.Chainable<JQuery<HTMLElement>> {
  return findGoaHosts("goa-badge", locator, "text", (el) => attributeOrSlotText(el, "content", "content"));
}
