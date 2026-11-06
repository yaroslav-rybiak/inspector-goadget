import { clickShadowControl } from "../internal/actions";
import { findGoaHosts, Locator, requireOneGoaHost } from "../internal/locate";
import { normalizeText } from "../internal/text";

/**
 * Finds the clickable element inside a goa-chip by its `content` text.
 * Yields the shadow `.chip` element.
 *
 * @param {Locator} locator - Chip content, or a locator object.
 * @example
 * getGoaChip("Alberta").should("have.class", "deletable");
 */
export function getGoaChip(locator: Locator): Cypress.Chainable<JQuery<HTMLElement>> {
  return findGoaHosts("goa-chip", locator, "text", (el) => normalizeText(el.getAttribute("content")))
    .shadow()
    .find(".chip");
}

/**
 * Clicks a goa-chip. The component fires `_click`; for a deletable chip the
 * application usually removes it in response.
 *
 * @param {Locator} locator - Chip content, or a locator object.
 * @example
 * clickGoaChip("Alberta");
 */
export function clickGoaChip(locator: Locator): void {
  requireOneGoaHost("clickGoaChip", "goa-chip", locator, "text", (el) => normalizeText(el.getAttribute("content")));
  clickShadowControl(getGoaChip(locator));
}
