import { getGoaFormItem } from "./goa-form-item";

/**
 * Finds the native textarea inside a goa-textarea by the label of its goa-form-item.
 *
 * Yields the shadow `textarea`, so `have.value` and similar assertions work directly.
 *
 * @param {string} label - The label of the goa-form-item that contains the textarea.
 * @example
 * getGoaTextarea("Comments").should("have.value", "Looks good");
 */
export function getGoaTextarea(label: string): Cypress.Chainable<JQuery<HTMLTextAreaElement>> {
  return getGoaFormItem(label).find("goa-textarea").shadow().find("textarea");
}

/**
 * Clears a goa-textarea and types new text into it.
 *
 * @param {string} label - The label of the goa-form-item that contains the textarea.
 * @param {string} text - The text to type.
 * @example
 * fillGoaTextarea("Comments", "Looks good");
 */
export function fillGoaTextarea(label: string, text: string): void {
  getGoaTextarea(label).click().clear().type(text);
}
