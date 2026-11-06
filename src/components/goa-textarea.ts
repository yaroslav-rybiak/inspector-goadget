import { findGoaHosts, Locator } from "../internal/locate";

/**
 * Finds the native textarea inside a goa-textarea.
 *
 * A string is the label of the surrounding goa-form-item; see {@link Locator} for
 * other ways. Yields the shadow `textarea`.
 *
 * @param {Locator} locator - Form-item label, or a locator object.
 * @example
 * getGoaTextarea("Comments").should("have.value", "Looks good");
 */
export function getGoaTextarea(locator: Locator): Cypress.Chainable<JQuery<HTMLTextAreaElement>> {
  return findGoaHosts("goa-textarea", locator, "label").shadow().find("textarea");
}

/**
 * Clears a goa-textarea and types new text into it.
 *
 * @param {Locator} locator - Form-item label, or a locator object.
 * @param {string} text - The text to type.
 * @example
 * fillGoaTextarea("Comments", "Looks good");
 */
export function fillGoaTextarea(locator: Locator, text: string): void {
  getGoaTextarea(locator).click().clear().type(text);
}
