import { getGoaFormItem } from "./goa-form-item";

/**
 * Finds the native input inside a goa-input by the label of its goa-form-item.
 *
 * Yields the shadow `input`, so `have.value` and similar assertions work directly.
 *
 * @param {string} label - The label of the goa-form-item that contains the input.
 * @example
 * getGoaInput("First name").should("have.value", "Ada");
 */
export function getGoaInput(label: string): Cypress.Chainable<JQuery<HTMLElement>> {
  return getGoaFormItem(label).find("goa-input").shadow().find("input");
}

/**
 * Clears a goa-input and types new text into it.
 *
 * @param {string} label - The label of the goa-form-item that contains the input.
 * @param {string} text - The text to type.
 * @example
 * fillGoaInput("Basic", "Hello, World");
 */
export function fillGoaInput(label: string, text: string): void {
  getGoaInput(label)
    .click() // Does not work without click
    .clear()
    .type(text);
}
