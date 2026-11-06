import { getGoaDropdown, selectGoaDropdown } from "../src/components/goa-dropdown";
import { visitFixturePage } from "./fixture-page";

describe("goa-dropdown", () => {
  beforeEach(() => {
    visitFixturePage("forms");
  });

  ["Red", "Green", "Blue"].forEach((optionText) => {
    it(`selectGoaDropdown selects '${optionText}' in the dropdown labelled 'Basic dropdown'`, () => {
      selectGoaDropdown("Basic dropdown", optionText);
      getGoaDropdown("Basic dropdown").should("have.value", optionText);
      cy.get('[data-testid="colour-value"]').should("have.text", optionText.toLowerCase());
    });
  });
});
