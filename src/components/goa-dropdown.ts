/**
 * Selects an option in a goa-dropdown by its visible text.
 *
 * Finds the goa-form-item with the given label, locates the goa-dropdown inside it,
 * opens it and clicks the option with the given text. The component fires `_change`
 * with the selected value.
 *
 * @param {string} label - The label of the goa-form-item that contains the dropdown.
 * @param {string} optionText - The visible text of the option to select.
 * @example
 * selectGoaDropdown("Basic dropdown", "Red");
 */
export function selectGoaDropdown(label: string, optionText: string): void {
  cy.get(`goa-form-item[label="${label}"]`)
    .find("goa-dropdown")
    .shadow()
    .find("goa-popover input")
    .click();

  cy.get(`goa-form-item[label="${label}"]`)
    .find("goa-dropdown")
    .shadow()
    .find("goa-popover ul")
    .contains("li", optionText)
    .click();
}
