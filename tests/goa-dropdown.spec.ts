import { selectGoaDropdownOption } from "../src/components/goa-dropdown";

describe("Select an option in the dropdown by label", () => {
  it("Finds the dropdown by label and selects RED option", () => {
    cy.visit("https://design.alberta.ca/components/dropdown#tab-0");
    selectGoaDropdownOption("Basic dropdown", "Red");
    cy.get('goa-form-item[label="Basic dropdown"]')
      .find("goa-dropdown")
      .shadow()
      .find("goa-popover input")
      .should("have.value", "Red");
  });
  it("Finds the dropdown by label and selects GREEN option", () => {
    cy.visit("https://design.alberta.ca/components/dropdown#tab-0");
    selectGoaDropdownOption("Basic dropdown", "Green");
    cy.get('goa-form-item[label="Basic dropdown"]')
      .find("goa-dropdown")
      .shadow()
      .find("goa-popover input")
      .should("have.value", "Green");
  });
});
