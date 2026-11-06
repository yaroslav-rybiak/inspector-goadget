/**
 * Clicks a goa-button component based on its visible text.
 *
 * Locates the goa-button by its visible text, pierces the shadow DOM, and clicks
 * the inner native button.
 *
 * The click is sent with `force: true` after checking that the inner button is
 * visible and enabled. The slotted button text sits on top of the shadow button, so
 * the browser's hit test resolves to the goa-button host and Cypress's own
 * actionability check never dispatches the click to the inner button.
 *
 * @param {string} buttonText - The visible text of the goa-button to locate.
 * @example
 * clickGoaButton("Primary Button");
 */
export function clickGoaButton(buttonText: string): void {
  cy.get("goa-button")
    .contains(buttonText)
    .shadow()
    .find("button")
    .should("be.visible")
    .and("not.be.disabled")
    .click({ force: true });
}
