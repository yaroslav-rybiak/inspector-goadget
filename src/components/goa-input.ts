import { findGoaHosts, Locator, requireOneGoaHost } from "../internal/locate";

/**
 * Finds the native input inside a goa-input.
 *
 * A string is the label of the surrounding goa-form-item. Pass a locator object for
 * other ways: `{ name: "email" }`, `{ within: '[data-cy="firstName"]' }`. Yields the
 * shadow `input`, so `have.value` and similar assertions work directly.
 *
 * @param {Locator} locator - Form-item label, or a locator object.
 * @example
 * getGoaInput("First name").should("have.value", "Ada");
 */
export function getGoaInput(locator: Locator): Cypress.Chainable<JQuery<HTMLInputElement>> {
  return findGoaHosts("goa-input", locator, "label").shadow().find("input");
}

/**
 * Clears a goa-input and types new text into it.
 *
 * @param {Locator} locator - Form-item label, or a locator object.
 * @param {string} text - The text to type.
 * @example
 * fillGoaInput("Basic", "Hello, World");
 */
export function fillGoaInput(locator: Locator, text: string): void {
  requireOneGoaHost("fillGoaInput", "goa-input", locator, "label");
  getGoaInput(locator)
    .click() // Does not work without click
    .clear()
    .type(text);
}
