import { setShadowChecked } from "../internal/actions";
import { normalizeText } from "../internal/text";
import { goaCheckboxText } from "./goa-checkbox";
import { getGoaFormItem } from "./goa-form-item";

/**
 * Finds a goa-checkbox-list by the label of its goa-form-item.
 *
 * Yields the goa-checkbox-list host element. The component reports its selected
 * values through the `_change` event.
 *
 * @param {string} label - The label of the goa-form-item that contains the list.
 * @example
 * getGoaCheckboxList("Toppings").find("goa-checkbox").should("have.length", 3);
 */
export function getGoaCheckboxList(label: string): Cypress.Chainable<JQuery<HTMLElement>> {
  return getGoaFormItem(label).find("goa-checkbox-list");
}

function setListItems(label: string, texts: string | string[], checked: boolean): void {
  const wanted = (Array.isArray(texts) ? texts : [texts]).map(normalizeText);
  getGoaCheckboxList(label).find("goa-checkbox").should("have.length.at.least", 1);
  for (const text of wanted) {
    const input = getGoaCheckboxList(label)
      .find("goa-checkbox")
      .filter((_, el) => goaCheckboxText(el) === text)
      .shadow()
      .find('input[type="checkbox"]');
    setShadowChecked(input, checked);
  }
}

/**
 * Checks one or more goa-checkbox items inside a goa-checkbox-list.
 *
 * @param {string} label - The label of the goa-form-item that contains the list.
 * @param {string | string[]} texts - The text of each checkbox to check.
 * @example
 * checkGoaCheckboxList("Toppings", ["Cheese", "Olives"]);
 */
export function checkGoaCheckboxList(label: string, texts: string | string[]): void {
  setListItems(label, texts, true);
}

/**
 * Unchecks one or more goa-checkbox items inside a goa-checkbox-list.
 *
 * @param {string} label - The label of the goa-form-item that contains the list.
 * @param {string | string[]} texts - The text of each checkbox to uncheck.
 * @example
 * uncheckGoaCheckboxList("Toppings", "Olives");
 */
export function uncheckGoaCheckboxList(label: string, texts: string | string[]): void {
  setListItems(label, texts, false);
}
