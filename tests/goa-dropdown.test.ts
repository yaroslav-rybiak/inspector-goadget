import { selectGoaDropdown } from "../src/components/goa-dropdown";
import { visitFixturePage } from "./fixture-page";

describe("selectGoaDropdown", () => {
  beforeEach(() => {
    visitFixturePage();
  });

  ["Red", "Green", "Blue"].forEach((optionText) => {
    it(`selects '${optionText}' in the dropdown labelled 'Basic dropdown'`, () => {
      selectGoaDropdown("Basic dropdown", optionText);
      cy.get('goa-form-item[label="Basic dropdown"]')
        .find("goa-dropdown")
        .shadow()
        .find("goa-popover input")
        .should("have.value", optionText);
      cy.get('[data-testid="dropdown-value"]').should(
        "have.text",
        optionText.toLowerCase()
      );
    });
  });
});
