import { typeInGoaInput } from "../src/components/goa-input";

describe("Type into goa-input", () => {
  it('Finds the goa-form-item with label "Basic" and types into the associated input "Hello, World"', () => {
    cy.visit("https://design.alberta.ca/components/input#tab-0");
    typeInGoaInput("Basic", "Hello, World");
    cy.get('goa-form-item[label="Basic"]')
      .find("goa-input")
      .should("have.value", "Hello, World");
  });
  it('Finds the goa-form-item with label "Basic" and types into the associated input "Goodbye, World"', () => {
    cy.visit("https://design.alberta.ca/components/input#tab-0");
    typeInGoaInput("Basic", "Goodbye, World");
    cy.get('goa-form-item[label="Basic"]')
      .find("goa-input")
      .should("have.value", "Goodbye, World");
  });
});
