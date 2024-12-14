/**
 * Types text into a goa-input element within a goa-form-item.
 *
 * This function finds the goa-form-item with the specified label,
 * locates the associated goa-input element, clicks into it,
 * and types the provided text.
 *
 * @param {string} label - The label of the goa-form-item to locate.
 * @param {string} text - The text to type into the input element.
 * @example
 * typeInGoaInput('Basic', 'Hello, World');
 */
export function typeInGoaInput(label: string, text: string): void {
  cy.get(`goa-form-item[label="${label}"]`)
    .find("goa-input")
    .shadow()
    .find("input")
    .click() // Does not work without click
    .type(text);
}
