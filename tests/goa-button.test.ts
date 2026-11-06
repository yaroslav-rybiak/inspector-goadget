import { clickGoaButton, getGoaButton } from "../src/components/goa-button";
import { visitFixturePage } from "./fixture-page";

describe("goa-button", () => {
  beforeEach(() => {
    visitFixturePage("buttons");
  });

  it("getGoaButton yields the native button", () => {
    getGoaButton("Primary Button").should("have.prop", "tagName", "BUTTON").and("not.be.disabled");
  });

  it("clickGoaButton clicks the 'Primary Button' goa-button", () => {
    clickGoaButton("Primary Button");
    cy.get('[data-testid="last-clicked"]').should("have.text", "Primary Button");
  });

  it("clickGoaButton clicks the 'Submit and continue' goa-button", () => {
    clickGoaButton("Submit and continue");
    cy.get('[data-testid="last-clicked"]').should("have.text", "Submit and continue");
  });
});
