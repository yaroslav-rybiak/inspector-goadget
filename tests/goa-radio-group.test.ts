import {
  getGoaRadioGroup,
  getGoaRadioItem,
  selectGoaRadioGroup,
} from "../src/components/goa-radio-group";
import { visitFixturePage } from "./fixture-page";

describe("goa-radio-group", () => {
  beforeEach(() => {
    visitFixturePage("forms");
  });

  it("getGoaRadioGroup yields the group host", () => {
    getGoaRadioGroup("Size").should("have.prop", "tagName", "GOA-RADIO-GROUP");
  });

  it("selectGoaRadioGroup selects an item and the group reports its value", () => {
    selectGoaRadioGroup("Size", "Medium");
    getGoaRadioItem("Size", "Medium").should("be.checked");
    cy.get('[data-testid="size-value"]').should("have.text", "m");
  });

  it("selectGoaRadioGroup moves the selection to another item", () => {
    selectGoaRadioGroup("Size", "Small");
    selectGoaRadioGroup("Size", "Large");
    getGoaRadioItem("Size", "Small").should("not.be.checked");
    getGoaRadioItem("Size", "Large").should("be.checked");
    cy.get('[data-testid="size-value"]').should("have.text", "l");
  });
});
