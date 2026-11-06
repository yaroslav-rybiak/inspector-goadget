import { fillGoaInput, getGoaInput } from "../src/components/goa-input";
import { visitFixturePage } from "./fixture-page";

describe("goa-input", () => {
  beforeEach(() => {
    visitFixturePage("forms");
  });

  it("fillGoaInput types 'Hello, World' into the input labelled 'Basic'", () => {
    fillGoaInput("Basic", "Hello, World");
    getGoaInput("Basic").should("have.value", "Hello, World");
    cy.get('[data-testid="basic-input-value"]').should("have.text", "Hello, World");
  });

  it("fillGoaInput replaces existing text instead of appending to it", () => {
    fillGoaInput("Basic", "Hello, World");
    fillGoaInput("Basic", "Goodbye, World");
    getGoaInput("Basic").should("have.value", "Goodbye, World");
  });
});
