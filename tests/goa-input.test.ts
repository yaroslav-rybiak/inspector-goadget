import { fillGoaInput } from "../src/components/goa-input";
import { visitFixturePage } from "./fixture-page";

describe("fillGoaInput", () => {
  beforeEach(() => {
    visitFixturePage();
  });

  it("types 'Hello, World' into the input labelled 'Basic'", () => {
    fillGoaInput("Basic", "Hello, World");
    cy.get('goa-form-item[label="Basic"]')
      .find("goa-input")
      .should("have.value", "Hello, World");
  });

  it("replaces existing text instead of appending to it", () => {
    fillGoaInput("Basic", "Hello, World");
    fillGoaInput("Basic", "Goodbye, World");
    cy.get('goa-form-item[label="Basic"]')
      .find("goa-input")
      .should("have.value", "Goodbye, World");
  });
});
