import { closeGoaAccordion, getGoaAccordion, openGoaAccordion } from "../src/components/goa-accordion";
import { closeGoaDetails, getGoaDetails, openGoaDetails } from "../src/components/goa-details";
import { visitFixturePage } from "./fixture-page";

describe("goa-accordion and goa-details", () => {
  beforeEach(() => visitFixturePage("widgets"));

  it("openGoaAccordion and closeGoaAccordion toggle and fire _change", () => {
    openGoaAccordion("Accordion heading");
    cy.get('[data-testid="events"]').should("contain.text", 'accordion:_change:{"open":true}');
    getGoaAccordion("Accordion heading").shadow().find("summary").should("have.attr", "aria-expanded", "true");
    openGoaAccordion("Accordion heading"); // no-op
    closeGoaAccordion("Accordion heading");
    cy.get('[data-testid="events"]').should("contain.text", 'accordion:_change:{"open":false}');
  });

  it("openGoaDetails and closeGoaDetails toggle the summary", () => {
    openGoaDetails("Show more");
    getGoaDetails("Show more").shadow().find("summary").should("have.attr", "aria-expanded", "true");
    closeGoaDetails("Show more");
    getGoaDetails("Show more").shadow().find("summary").should("have.attr", "aria-expanded", "false");
  });
});
