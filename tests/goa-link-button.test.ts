import { clickGoaLinkButton, getGoaLinkButton } from "../src/components/goa-link-button";
import { visitFixturePage } from "./fixture-page";

describe("goa-link-button", () => {
  beforeEach(() => visitFixturePage("widgets"));

  it("clickGoaLinkButton fires _click", () => {
    getGoaLinkButton("Link button").should("have.prop", "tagName", "BUTTON");
    clickGoaLinkButton("Link button");
    cy.get('[data-testid="events"]').should("contain.text", "link-button:_click:");
  });
});
