import { clickShadowControl } from "../internal/actions";
import { findGoaHosts, Locator, requireOneGoaHost } from "../internal/locate";

/**
 * Finds the native button inside a goa-button.
 *
 * A string matches the button's visible text exactly (whitespace collapsed). Pass a
 * locator object for other ways: `{ text: /^Submit/ }`, `{ within: '[data-cy="next"]' }`,
 * `{ testid: "save" }`. Yields the shadow `button`, so `be.disabled` works directly.
 *
 * @param {Locator} locator - Button text, or a locator object.
 * @example
 * getGoaButton("Submit").should("be.disabled");
 * getGoaButton({ within: '[data-cy="next"]' }).click();
 */
export function getGoaButton(locator: Locator): Cypress.Chainable<JQuery<HTMLButtonElement>> {
  return findGoaHosts("goa-button", locator, "text").shadow().find("button");
}

/**
 * Clicks a goa-button.
 *
 * Checks that the inner button is visible and enabled, then clicks with
 * `force: true`. The slotted text covers the shadow button, so the browser's hit
 * test resolves to the goa-button host and a normal Cypress click never reaches
 * the inner button.
 *
 * @param {Locator} locator - Button text, or a locator object.
 * @example
 * clickGoaButton("Primary Button");
 * clickGoaButton({ within: '[data-cy="next"]' });
 */
export function clickGoaButton(locator: Locator): void {
  requireOneGoaHost("clickGoaButton", "goa-button", locator, "text");
  clickShadowControl(getGoaButton(locator));
}
