import { setShadowChecked } from "../internal/actions";
import { findGoaHosts, Locator } from "../internal/locate";
import { cssAttrValue } from "../internal/text";

function host(locator: Locator): Cypress.Chainable<JQuery<HTMLElement>> {
  return findGoaHosts("goa-dropdown-multiselect", locator, "label");
}

/**
 * Finds the trigger of a goa-dropdown-multiselect.
 *
 * A string is the label of the surrounding goa-form-item; see {@link Locator} for
 * other ways. Yields the shadow `[role="combobox"]` element. Its text lists the
 * selected option labels, and `aria-expanded` tells whether the option list is open.
 * The component reports selected values through the `_change` event.
 *
 * @param {Locator} locator - Form-item label, or a locator object.
 * @example
 * getGoaDropdownMultiselect("Languages").should("contain.text", "French");
 */
export function getGoaDropdownMultiselect(locator: Locator): Cypress.Chainable<JQuery<HTMLElement>> {
  return host(locator).shadow().find('[role="combobox"]');
}

function setOpen(locator: Locator, open: boolean): void {
  getGoaDropdownMultiselect(locator).then(($trigger) => {
    if (($trigger.attr("aria-expanded") === "true") !== open) {
      cy.wrap($trigger, { log: false }).click();
    }
  });
  getGoaDropdownMultiselect(locator).should("have.attr", "aria-expanded", String(open));
}

function setOptions(locator: Locator, optionTexts: string | string[], checked: boolean): void {
  const texts = Array.isArray(optionTexts) ? optionTexts : [optionTexts];
  setOpen(locator, true);
  for (const text of texts) {
    const input = host(locator)
      .shadow()
      .find("goa-checkbox")
      .shadow()
      .find(`input[type="checkbox"][aria-label="${cssAttrValue(text)}"]`);
    setShadowChecked(input, checked);
  }
  setOpen(locator, false);
}

/**
 * Selects one or more options in a goa-dropdown-multiselect by their visible text.
 *
 * Opens the list, checks each option that is not already selected, then closes it.
 *
 * @param {Locator} locator - Form-item label, or a locator object.
 * @param {string | string[]} optionTexts - The visible text of each option to select.
 * @example
 * selectGoaDropdownMultiselect("Languages", ["English", "French"]);
 */
export function selectGoaDropdownMultiselect(locator: Locator, optionTexts: string | string[]): void {
  setOptions(locator, optionTexts, true);
}

/**
 * Deselects one or more options in a goa-dropdown-multiselect by their visible text.
 *
 * @param {Locator} locator - Form-item label, or a locator object.
 * @param {string | string[]} optionTexts - The visible text of each option to deselect.
 * @example
 * deselectGoaDropdownMultiselect("Languages", "French");
 */
export function deselectGoaDropdownMultiselect(locator: Locator, optionTexts: string | string[]): void {
  setOptions(locator, optionTexts, false);
}
