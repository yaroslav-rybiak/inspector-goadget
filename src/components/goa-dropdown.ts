import { getGoaFormItem } from "./goa-form-item";

/**
 * Finds the combobox input inside a goa-dropdown by the label of its goa-form-item.
 *
 * Yields the shadow `input[role="combobox"]`, whose value is the text of the
 * selected option. The goa-dropdown host's own `value` property is not updated
 * by the component, so assert on this input or listen for `_change`.
 *
 * @param {string} label - The label of the goa-form-item that contains the dropdown.
 * @example
 * getGoaDropdown("Province").should("have.value", "Alberta");
 */
export function getGoaDropdown(label: string): Cypress.Chainable<JQuery<HTMLElement>> {
  return getGoaFormItem(label)
    .find("goa-dropdown")
    .shadow()
    .find('goa-popover input[role="combobox"]');
}

/**
 * Selects an option in a goa-dropdown by its visible text.
 *
 * Opens the dropdown and clicks the option. The component fires `_change` with the
 * selected value.
 *
 * @param {string} label - The label of the goa-form-item that contains the dropdown.
 * @param {string} optionText - The visible text of the option to select.
 * @example
 * selectGoaDropdown("Basic dropdown", "Red");
 */
export function selectGoaDropdown(label: string, optionText: string): void {
  getGoaDropdown(label).click();
  getGoaFormItem(label)
    .find("goa-dropdown")
    .shadow()
    .find('goa-popover ul[role="listbox"]')
    .contains('li[role="option"]', optionText)
    .click();
}
