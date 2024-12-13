export function typeInGoaInput(label, text) {
  cy.get(`goa-form-item[label="${label}"]`)
    .find("goa-input")
    .shadow()
    .find("input")
    .click() // Does not work without click
    .type(text);
}
