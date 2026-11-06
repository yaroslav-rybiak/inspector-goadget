import { setShadowChecked } from "../internal/actions";
import { cssAttrValue } from "../internal/text";
import { getGoaFormItem } from "./goa-form-item";

function host(label: string): Cypress.Chainable<JQuery<HTMLElement>> {
  return getGoaFormItem(label).find("goa-dropdown-multiselect");
}

/**
 * Finds the trigger of a goa-dropdown-multiselect by the label of its goa-form-item.
 *
 * Yields the shadow `[role="combobox"]` element. Its text lists the selected option
 * labels, and `aria-expanded` tells whether the option list is open. The component
 * reports selected values through the `_change` event.
 *
 * @param {string} label - The label of the goa-form-item that contains the multiselect.
 * @example
 * getGoaDropdownMultiselect("Languages").should("contain.text", "French");
 */
export function getGoaDropdownMultiselect(label: string): Cypress.Chainable<JQuery<HTMLElement>> {
  return host(label).shadow().find('[role="combobox"]');
}

function setOpen(label: string, open: boolean): void {
  getGoaDropdownMultiselect(label).then(($trigger) => {
    if (($trigger.attr("aria-expanded") === "true") !== open) {
      cy.wrap($trigger, { log: false }).click();
    }
  });
  getGoaDropdownMultiselect(label).should("have.attr", "aria-expanded", String(open));
}

function setOptions(label: string, optionTexts: string | string[], checked: boolean): void {
  const texts = Array.isArray(optionTexts) ? optionTexts : [optionTexts];
  setOpen(label, true);
  for (const text of texts) {
    const input = host(label)
      .shadow()
      .find("goa-checkbox")
      .shadow()
      .find(`input[type="checkbox"][aria-label="${cssAttrValue(text)}"]`);
    setShadowChecked(input, checked);
  }
  setOpen(label, false);
}

/**
 * Selects one or more options in a goa-dropdown-multiselect by their visible text.
 *
 * Opens the list, checks each option that is not already selected, then closes it.
 *
 * @param {string} label - The label of the goa-form-item that contains the multiselect.
 * @param {string | string[]} optionTexts - The visible text of each option to select.
 * @example
 * selectGoaDropdownMultiselect("Languages", ["English", "French"]);
 */
export function selectGoaDropdownMultiselect(label: string, optionTexts: string | string[]): void {
  setOptions(label, optionTexts, true);
}

/**
 * Deselects one or more options in a goa-dropdown-multiselect by their visible text.
 *
 * @param {string} label - The label of the goa-form-item that contains the multiselect.
 * @param {string | string[]} optionTexts - The visible text of each option to deselect.
 * @example
 * deselectGoaDropdownMultiselect("Languages", "French");
 */
export function deselectGoaDropdownMultiselect(label: string, optionTexts: string | string[]): void {
  setOptions(label, optionTexts, false);
}
