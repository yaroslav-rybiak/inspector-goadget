import { clickGoaIconButton, getGoaIconButton } from "../src/components/goa-icon-button";
import { visitFixturePage } from "./fixture-page";

describe("goa-icon-button", () => {
  beforeEach(() => visitFixturePage("widgets"));

  it("getGoaIconButton matches the aria label or the icon name", () => {
    getGoaIconButton("Delete row").should("have.attr", "aria-label", "Delete row");
    getGoaIconButton({ icon: "trash" }).should("have.length", 1);
  });

  it("clickGoaIconButton fires _click", () => {
    clickGoaIconButton("Delete row");
    cy.get('[data-testid="events"]').should("contain.text", "icon:_click");
  });
});
