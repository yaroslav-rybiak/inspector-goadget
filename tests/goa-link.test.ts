import { clickGoaLink, getGoaLink } from "../src/components/goa-link";
import { visitFixturePage } from "./fixture-page";

describe("goa-link", () => {
  beforeEach(() => visitFixturePage("widgets"));

  it("clickGoaLink clicks the wrapped anchor", () => {
    getGoaLink("Plain link").find("a").should("have.attr", "href", "#link-target");
    clickGoaLink("Plain link");
    cy.get('[data-testid="events"]').should("contain.text", "link:#link-target");
  });
});
