import { setShadowChecked } from "../internal/actions";
import { normalizeText } from "../internal/text";

/** The visible text of a goa-checkbox: its `text` attribute or its slotted content. */
export function goaCheckboxText(checkbox: Element): string {
  const attribute = checkbox.getAttribute("text");
  if (attribute && attribute.trim()) return normalizeText(attribute);
  return normalizeText(checkbox.textContent);
}

/**
 * Finds the native checkbox input inside a goa-checkbox by the checkbox's visible text.
 *
 * Yields the shadow `input[type="checkbox"]`, so `be.checked` works directly. Scope
 * with `.within()` on a container when the same text appears more than once.
 *
 * @param {string} text - The text shown next to the checkbox.
 * @example
 * getGoaCheckbox("I agree to the terms").should("be.checked");
 */
export function getGoaCheckbox(text: string): Cypress.Chainable<JQuery<HTMLElement>> {
  const wanted = normalizeText(text);
  return cy
    .get("goa-checkbox")
    .filter((_, el) => goaCheckboxText(el) === wanted)
    .shadow()
    .find('input[type="checkbox"]');
}

/**
 * Checks a goa-checkbox by its visible text. Does nothing if it is already checked.
 *
 * @param {string} text - The text shown next to the checkbox.
 * @example
 * checkGoaCheckbox("I agree to the terms");
 */
export function checkGoaCheckbox(text: string): void {
  setShadowChecked(getGoaCheckbox(text), true);
}

/**
 * Unchecks a goa-checkbox by its visible text. Does nothing if it is already unchecked.
 *
 * @param {string} text - The text shown next to the checkbox.
 * @example
 * uncheckGoaCheckbox("Send me the newsletter");
 */
export function uncheckGoaCheckbox(text: string): void {
  setShadowChecked(getGoaCheckbox(text), false);
}
