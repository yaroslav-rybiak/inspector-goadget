import { goaOpen } from "../src/internal/attributes";
import { getGoaTab, getGoaTabs, selectGoaTab } from "../src/components/goa-tabs";
import { visitFixturePage } from "./fixture-page";

describe("goa-tabs", () => {
  beforeEach(() => visitFixturePage("widgets"));

  it("selectGoaTab switches the open tab and fires _change", () => {
    getGoaTabs().should("have.length", 1);
    getGoaTab("Profile").should(goaOpen());
    selectGoaTab("Documents");
    getGoaTab("Documents").should(goaOpen());
    getGoaTab("Profile").should(goaOpen(false));
    cy.get('[data-testid="events"]').should("contain.text", 'tabs:_change:{"tab":2}');
  });
});
