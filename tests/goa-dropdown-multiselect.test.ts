import {
  deselectGoaDropdownMultiselect,
  getGoaDropdownMultiselect,
  getGoaDropdownMultiselectOptions,
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

  it("getGoaDropdownMultiselectOptions lists the options and the checked state", () => {
    getGoaDropdownMultiselectOptions("Languages").should("deep.equal", ["English", "French", "Ukrainian"]);
    getGoaDropdownMultiselect("Languages").should("have.attr", "aria-expanded", "false");
    selectGoaDropdownMultiselect("Languages", "French");
    getGoaDropdownMultiselectOptions("Languages", { checked: true }).should("deep.equal", [
      { text: "English", checked: false },
      { text: "French", checked: true },
      { text: "Ukrainian", checked: false },
    ]);
    cy.get('[data-testid="languages-value"]').should("have.text", '["fr"]');
  });
});
