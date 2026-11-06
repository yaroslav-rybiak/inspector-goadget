import { getGoaDropdown, getGoaDropdownOptions, selectGoaDropdown } from "../src/components/goa-dropdown";
import { goaOpen } from "../src/internal/attributes";
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

  it("getGoaDropdownOptions lists the options in display order and leaves the field closed", () => {
    getGoaDropdownOptions("Basic dropdown").should("deep.equal", ["Red", "Green", "Blue"]);
    cy.get("#basic-dropdown").shadow().find("goa-popover").should(goaOpen(false));
  });

  it("getGoaDropdownOptions does not change the selection", () => {
    selectGoaDropdown("Basic dropdown", "Green");
    getGoaDropdownOptions("Basic dropdown").should("have.length", 3);
    getGoaDropdown("Basic dropdown").should("have.value", "Green");
    cy.get('[data-testid="colour-value"]').should("have.text", "green");
  });

  it("getGoaDropdownOptions with values yields value and text", () => {
    getGoaDropdownOptions("Basic dropdown", { values: true }).should("deep.equal", [
      { value: "red", text: "Red" },
      { value: "green", text: "Green" },
      { value: "blue", text: "Blue" },
    ]);
  });

  it("getGoaDropdownOptions with filter lists only matching options, and none when nothing matches", () => {
    getGoaDropdownOptions({ name: "worker" }, { filter: "Doe" }).should("deep.equal", ["Jane Doe, CEC", "John Doe, SFSC"]);
    getGoaDropdownOptions({ name: "worker" }, { filter: "Nobody" }).should("be.empty");
  });

  it("getGoaDropdownOptions with filter keeps a previous selection and fires no change", () => {
    selectGoaDropdown({ name: "worker" }, /^Ann Smith/);
    cy.get('[data-testid="worker-value"]').should("have.text", "3");
    getGoaDropdownOptions({ name: "worker" }, { filter: "Doe" }).should("have.length", 2);
    getGoaDropdown({ name: "worker" }).should("have.value", "Ann Smith, CEC");
    cy.get('[data-testid="worker-value"]').should("have.text", "3");
  });

  it("selectGoaDropdown with filter replaces a previous selection without an empty change in between", () => {
    const changes: string[] = [];
    cy.get('goa-dropdown[name="worker"]').then(($dd) => {
      $dd[0].addEventListener("_change", (event) => changes.push(String((event as CustomEvent).detail.value)));
    });
    selectGoaDropdown({ name: "worker" }, /^Ann Smith/);
    selectGoaDropdown({ name: "worker" }, /^Jane Doe,/, { filter: "Jane" });
    getGoaDropdown({ name: "worker" }).should("have.value", "Jane Doe, CEC");
    cy.then(() => expect(changes).to.deep.equal(["3", "1"]));
  });
});
