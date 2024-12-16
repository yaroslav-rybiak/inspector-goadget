import { clickGoaButton } from "../src/components/goa-button";

describe("Click a goa-button", () => {
  it("Finds the 'Primary Button' goa-button and clicks its inner button", () => {
    cy.visit("https://design.alberta.ca/components/button#tab-0");
    clickGoaButton("Primary Button");
  });
  it("Finds the 'Submit and continue' goa-button and clicks its inner button", () => {
    cy.visit("https://design.alberta.ca/components/button#tab-0");
    clickGoaButton("Submit and continue");
  });
});
