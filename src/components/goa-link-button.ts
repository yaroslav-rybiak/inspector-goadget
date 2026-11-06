import { clickShadowControl } from "../internal/actions";
import { findGoaHosts, Locator, requireOneGoaHost } from "../internal/locate";

/**
 * Finds the native button inside a goa-link-button by its visible text.
 * Yields the shadow `button`.
 *
 * @param {Locator} locator - Button text, or a locator object.
 * @example
 * getGoaLinkButton("Edit").should("be.visible");
 */
export function getGoaLinkButton(locator: Locator): Cypress.Chainable<JQuery<HTMLButtonElement>> {
  return findGoaHosts("goa-link-button", locator, "text").shadow().find("button");
}

/**
 * Clicks a goa-link-button. The component fires `_click`.
 *
 * @param {Locator} locator - Button text, or a locator object.
 * @example
 * clickGoaLinkButton("Edit");
 */
export function clickGoaLinkButton(locator: Locator): void {
  requireOneGoaHost("clickGoaLinkButton", "goa-link-button", locator, "text");
  clickShadowControl(getGoaLinkButton(locator));
}
