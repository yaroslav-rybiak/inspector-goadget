import { clickGoaMicrositeHeader, getGoaMicrositeHeader } from "../src/components/goa-microsite-header";
import { visitFixturePage } from "./fixture-page";

describe("goa-microsite-header", () => {
  beforeEach(() => visitFixturePage("display"));

  it("locates headers by type", () => {
    getGoaMicrositeHeader().should("have.length", 2);
    getGoaMicrositeHeader({ selector: '[type="alpha"]' }).should("have.attr", "version", "1.0.0");
  });

  it("clickGoaMicrositeHeader fires _feedbackClick when the header has a handler", () => {
    clickGoaMicrositeHeader({ selector: '[type="beta"]' });
    cy.get('[data-testid="events"]').should("contain.text", "microsite-handler:_feedbackClick");
  });

  it("clickGoaMicrositeHeader follows the feedback link otherwise", () => {
    getGoaMicrositeHeader({ selector: '[type="alpha"]' })
      .shadow()
      .find('[data-testid="feedback"] a')
      .should("have.attr", "href", "#feedback")
      .invoke("removeAttr", "target");
    clickGoaMicrositeHeader({ selector: '[type="alpha"]' });
    cy.location("hash").should("eq", "#feedback");
  });
});
