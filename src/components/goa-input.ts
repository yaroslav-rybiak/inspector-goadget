/**
 * Clears a goa-input and types new text into it.
 *
 * Finds the goa-form-item with the given label, locates the goa-input inside it,
 * pierces the shadow DOM, clicks the native input, clears it and types the text.
 *
 * @param {string} label - The label of the goa-form-item that contains the input.
 * @param {string} text - The text to type.
 * @example
 * fillGoaInput("Basic", "Hello, World");
 */
export function fillGoaInput(label: string, text: string): void {
  cy.get(`goa-form-item[label="${label}"]`)
    .find("goa-input")
    .shadow()
    .find("input")
    .click() // Does not work without click
    .clear()
    .type(text);
}
