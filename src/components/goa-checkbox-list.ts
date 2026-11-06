import { setShadowChecked } from "../internal/actions";
import { findGoaHosts, Locator, matchesText, TextMatch } from "../internal/locate";
import { goaCheckboxText } from "./goa-checkbox";

/**
 * Finds a goa-checkbox-list.
 *
 * A string is the label of the surrounding goa-form-item; see {@link Locator} for
 * other ways. Yields the goa-checkbox-list host element. The component reports its
 * selected values through the `_change` event.
 *
 * @param {Locator} locator - Form-item label, or a locator object.
 * @example
 * getGoaCheckboxList("Toppings").find("goa-checkbox").should("have.length", 3);
 */
export function getGoaCheckboxList(locator: Locator): Cypress.Chainable<JQuery<HTMLElement>> {
  return findGoaHosts("goa-checkbox-list", locator, "label");
}

function setListItems(locator: Locator, texts: TextMatch | TextMatch[], checked: boolean): void {
  const wanted = Array.isArray(texts) ? texts : [texts];
  getGoaCheckboxList(locator).find("goa-checkbox").should("have.length.at.least", 1);
  for (const text of wanted) {
    const input = getGoaCheckboxList(locator)
      .find("goa-checkbox")
      .filter((_, el) => matchesText(goaCheckboxText(el), text))
      .shadow()
      .find('input[type="checkbox"]');
    setShadowChecked(input, checked);
  }
}

/**
 * Checks one or more goa-checkbox items inside a goa-checkbox-list.
 *
 * @param {Locator} locator - Form-item label, or a locator object.
 * @param {string | RegExp | Array} texts - The text of each checkbox to check.
 * @example
 * checkGoaCheckboxList("Toppings", ["Cheese", "Olives"]);
 */
export function checkGoaCheckboxList(locator: Locator, texts: TextMatch | TextMatch[]): void {
  setListItems(locator, texts, true);
}

/**
 * Unchecks one or more goa-checkbox items inside a goa-checkbox-list.
 *
 * @param {Locator} locator - Form-item label, or a locator object.
 * @param {string | RegExp | Array} texts - The text of each checkbox to uncheck.
 * @example
 * uncheckGoaCheckboxList("Toppings", "Olives");
 */
export function uncheckGoaCheckboxList(locator: Locator, texts: TextMatch | TextMatch[]): void {
  setListItems(locator, texts, false);
}
