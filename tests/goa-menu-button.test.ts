import { clickGoaMenuAction } from "../src/components/goa-menu-action";
import { getGoaMenuButton, openGoaMenuButton, selectGoaMenuButton } from "../src/components/goa-menu-button";
import { visitFixturePage } from "./fixture-page";

describe("goa-menu-button", () => {
  beforeEach(() => visitFixturePage("widgets"));

  it("selectGoaMenuButton opens the menu and clicks an action", () => {
    getGoaMenuButton("Assign next").find("goa-menu-action").should("have.length", 2);
    selectGoaMenuButton("Assign next", "Assign 5 files");
    cy.get('[data-testid="events"]').should("contain.text", 'menu:_action:"assign-5"');
  });

  it("openGoaMenuButton plus clickGoaMenuAction, located through data-cy", () => {
    openGoaMenuButton({ within: '[data-cy="assign-next"]' });
    clickGoaMenuAction({ text: /^Assign 1/ });
    cy.get('[data-testid="events"]').should("contain.text", 'menu:_action:"assign-1"');
  });
});
