import { clickShadowControl } from "../internal/actions";
import { attributeOrSlotText, findGoaHosts, Locator } from "../internal/locate";

/**
 * Finds a goa-filter-chip by its content (`content` attribute or `slot="content"`).
 * Yields the goa-filter-chip host.
 *
 * @param {Locator} locator - Chip content, or a locator object.
 * @example
 * getGoaFilterChip("Status: Open").should("exist");
 */
export function getGoaFilterChip(locator: Locator): Cypress.Chainable<JQuery<HTMLElement>> {
  return findGoaHosts("goa-filter-chip", locator, "text", (el) => attributeOrSlotText(el, "content", "content"));
}

/**
 * Clicks the remove icon of a goa-filter-chip. The component fires `_click`; the
 * application usually removes the chip in response.
 *
 * @param {Locator} locator - Chip content, or a locator object.
 * @example
 * removeGoaFilterChip("Status: Open");
 */
export function removeGoaFilterChip(locator: Locator): void {
  clickShadowControl(getGoaFilterChip(locator).shadow().find("goa-icon-button").shadow().find("button"));
}
