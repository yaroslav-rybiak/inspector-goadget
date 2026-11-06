import { clickGoaButton } from "../src/components/goa-button";
import { visitFixturePage } from "./fixture-page";

describe("clickGoaButton", () => {
  beforeEach(() => {
    visitFixturePage();
  });

  it("clicks the 'Primary Button' goa-button", () => {
    clickGoaButton("Primary Button");
    cy.get('[data-testid="last-clicked"]').should("have.text", "Primary Button");
  });

  it("clicks the 'Submit and continue' goa-button", () => {
    clickGoaButton("Submit and continue");
    cy.get('[data-testid="last-clicked"]').should("have.text", "Submit and continue");
  });
});
