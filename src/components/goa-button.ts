import { clickShadowControl } from "../internal/actions";

/**
 * Finds the native button inside a goa-button by the button's visible text.
 *
 * Yields the shadow `button`, so assertions such as `be.disabled` work directly.
 *
 * @param {string} buttonText - The visible text of the goa-button.
 * @example
 * getGoaButton("Submit").should("be.disabled");
 */
export function getGoaButton(buttonText: string): Cypress.Chainable<JQuery<HTMLElement>> {
  return cy.get("goa-button").contains(buttonText).shadow().find("button");
}

/**
 * Clicks a goa-button by its visible text.
 *
 * Checks that the inner button is visible and enabled, then clicks with
 * `force: true`. The slotted text covers the shadow button, so the browser's hit
 * test resolves to the goa-button host and a normal Cypress click never reaches
 * the inner button.
 *
 * @param {string} buttonText - The visible text of the goa-button.
 * @example
 * clickGoaButton("Primary Button");
 */
export function clickGoaButton(buttonText: string): void {
  clickShadowControl(getGoaButton(buttonText));
}
