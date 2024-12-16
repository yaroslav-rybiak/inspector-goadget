/**
 * Selects an option in a goa-dropdown element based on its label and option text.
 *
 * This function locates the goa-form-item with the specified label, finds the associated goa-dropdown,
 * opens it, and selects the specified option by its visible label.
 *
 * @param {string} label - The label of the goa-form-item containing the dropdown.
 * @param {string} optionText - The text of the option to select.
 * @example
 * selectDropdownOptionByLabel("Basic dropdown", "Red");
 */
export function selectGoaDropdownOption(
  label: string,
  optionText: string
): void {
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
