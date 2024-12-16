/**
 * Clicks a button inside a goa-button component based on its visible text.
 *
 * This function locates a goa-button component by its visible text, accesses the shadow DOM,
 * and clicks the inner button.
 *
 * @param {string} buttonText - The visible text of the goa-button to locate.
 * @example
 * clickGoaButtonByText("Primary Button");
 */
export function clickGoaButton(buttonText: string): void {
  cy.get("goa-button").contains(buttonText).shadow().find("button").click();
}
