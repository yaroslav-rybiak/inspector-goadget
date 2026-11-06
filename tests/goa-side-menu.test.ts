import {
  clickGoaSideMenu,
  closeGoaSideMenuGroup,
  getGoaSideMenu,
  openGoaSideMenuGroup,
} from "../src/components/goa-side-menu";
import {
  clickGoaWorkSideMenuItem,
  getGoaWorkSideMenu,
  getGoaWorkSideMenuItem,
  openGoaWorkSideMenu,
  openGoaWorkSideMenuGroup,
} from "../src/components/goa-work-side-menu";
import { visitFixturePage } from "./fixture-page";

describe("side menus", () => {
  beforeEach(() => visitFixturePage("widgets"));

  it("clickGoaSideMenu clicks a top-level link", () => {
    getGoaSideMenu().should("have.length", 1);
    clickGoaSideMenu("Dashboard");
    cy.get('[data-testid="events"]').should("contain.text", "link:#dashboard");
  });

  it("openGoaSideMenuGroup reveals grouped links", () => {
    openGoaSideMenuGroup("Cases");
    clickGoaSideMenu("Closed cases");
    cy.get('[data-testid="events"]').should("contain.text", "link:#closed-cases");
    closeGoaSideMenuGroup("Cases");
  });

  it("clickGoaWorkSideMenuItem clicks an item and groups can be opened", () => {
    getGoaWorkSideMenu().should("have.attr", "heading", "DEED");
    getGoaWorkSideMenuItem("Alerts").should("have.attr", "href", "#alerts");
    clickGoaWorkSideMenuItem("Alerts");
    cy.get('[data-testid="events"]').should("contain.text", 'wsm-alerts:_navigate:{"url":"#alerts"}');
    openGoaWorkSideMenu();
    openGoaWorkSideMenuGroup("Files");
    getGoaWorkSideMenuItem("Assigned").should("be.visible");
  });
});
