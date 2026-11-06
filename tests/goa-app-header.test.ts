import { clickGoaAppHeader, getGoaAppHeader } from "../src/components/goa-app-header";
import { getGoaAppHeaderMenu, selectGoaAppHeaderMenu } from "../src/components/goa-app-header-menu";
import { clickGoaButton } from "../src/components/goa-button";
import { visitFixturePage } from "./fixture-page";

describe("goa-app-header", () => {
  beforeEach(() => visitFixturePage("widgets"));

  it("clickGoaAppHeader clicks a navigation link", () => {
    getGoaAppHeader().should("have.attr", "heading", "Case Management");
    clickGoaAppHeader("Cases");
    cy.get('[data-testid="events"]').should("contain.text", "link:#cases");
  });

  it("buttons in the header are reachable with within()", () => {
    getGoaAppHeader().within(() => clickGoaButton("Sign in"));
    cy.get('[data-testid="events"]').should("contain.text", "sign-in:_click");
  });

  it("selectGoaAppHeaderMenu opens the menu and clicks a link", () => {
    getGoaAppHeaderMenu("Reports").find("a").should("have.length", 2);
    selectGoaAppHeaderMenu("Reports", "Annual report");
    cy.get('[data-testid="events"]').should("contain.text", "link:#annual");
  });
});
