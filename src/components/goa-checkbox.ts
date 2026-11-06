import { setShadowChecked } from "../internal/actions";
import { findGoaHosts, Locator } from "../internal/locate";
import { normalizeText } from "../internal/text";

/** The visible text of a goa-checkbox: its `text` attribute or its slotted content. */
export function goaCheckboxText(checkbox: Element): string {
  const attribute = checkbox.getAttribute("text");
  if (attribute && attribute.trim()) return normalizeText(attribute);
  return normalizeText(checkbox.textContent);
}

/**
 * Finds the native checkbox input inside a goa-checkbox.
 *
 * A string is the checkbox's visible text. Pass a locator object for other ways:
 * `{ name: "terms" }`, `{ label: "Agreement" }` (the surrounding form item),
 * `{ within: '[data-cy="agreeDeclaration"]' }`. Yields the shadow
 * `input[type="checkbox"]`, so `be.checked` works directly.
 *
 * @param {Locator} locator - Checkbox text, or a locator object.
 * @example
 * getGoaCheckbox("I agree to the terms").should("be.checked");
 */
export function getGoaCheckbox(locator: Locator): Cypress.Chainable<JQuery<HTMLElement>> {
  return findGoaHosts("goa-checkbox", locator, "text", goaCheckboxText)
    .shadow()
    .find('input[type="checkbox"]');
}

/**
 * Checks a goa-checkbox. Does nothing if it is already checked.
 *
 * @param {Locator} locator - Checkbox text, or a locator object.
 * @example
 * checkGoaCheckbox("I agree to the terms");
 */
export function checkGoaCheckbox(locator: Locator): void {
  setShadowChecked(getGoaCheckbox(locator), true);
}

/**
 * Unchecks a goa-checkbox. Does nothing if it is already unchecked.
 *
 * @param {Locator} locator - Checkbox text, or a locator object.
 * @example
 * uncheckGoaCheckbox("Send me the newsletter");
 */
export function uncheckGoaCheckbox(locator: Locator): void {
  setShadowChecked(getGoaCheckbox(locator), false);
}
