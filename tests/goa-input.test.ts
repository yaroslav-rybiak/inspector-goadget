import { typeInGoaInput } from "../src/components/goa-input";
import { visitFixturePage } from "./fixture-page";

describe("typeInGoaInput", () => {
  beforeEach(() => {
    visitFixturePage();
  });

  it("types 'Hello, World' into the input labelled 'Basic'", () => {
    typeInGoaInput("Basic", "Hello, World");
    cy.get('goa-form-item[label="Basic"]')
      .find("goa-input")
      .should("have.value", "Hello, World");
  });

  it("replaces existing text instead of appending to it", () => {
    typeInGoaInput("Basic", "Hello, World");
    typeInGoaInput("Basic", "Goodbye, World");
    cy.get('goa-form-item[label="Basic"]')
      .find("goa-input")
      .should("have.value", "Goodbye, World");
  });
});
