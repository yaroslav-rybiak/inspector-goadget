import {
  deselectGoaDropdownMultiselect,
  getGoaDropdownMultiselect,
  selectGoaDropdownMultiselect,
} from "../src/components/goa-dropdown-multiselect";
import { visitFixturePage } from "./fixture-page";

describe("goa-dropdown-multiselect", () => {
  beforeEach(() => {
    visitFixturePage("forms");
  });

  it("selectGoaDropdownMultiselect selects several options and closes the list", () => {
    selectGoaDropdownMultiselect("Languages", ["French", "Ukrainian"]);
    getGoaDropdownMultiselect("Languages")
      .should("contain.text", "French, Ukrainian")
      .and("have.attr", "aria-expanded", "false");
    cy.get('[data-testid="languages-value"]').should("have.text", '["fr","uk"]');
  });

  it("selectGoaDropdownMultiselect accepts a single option", () => {
    selectGoaDropdownMultiselect("Languages", "English");
    cy.get('[data-testid="languages-value"]').should("have.text", '["en"]');
  });

  it("deselectGoaDropdownMultiselect removes an option from the selection", () => {
    selectGoaDropdownMultiselect("Languages", ["English", "French"]);
    deselectGoaDropdownMultiselect("Languages", "English");
    getGoaDropdownMultiselect("Languages").should("contain.text", "French").and("not.contain.text", "English");
    cy.get('[data-testid="languages-value"]').should("have.text", '["fr"]');
  });
});
