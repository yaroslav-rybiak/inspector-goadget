import {
  checkGoaCheckboxList,
  getGoaCheckboxList,
  uncheckGoaCheckboxList,
} from "../src/components/goa-checkbox-list";
import { getGoaCheckbox } from "../src/components/goa-checkbox";
import { visitFixturePage } from "./fixture-page";

describe("goa-checkbox-list", () => {
  beforeEach(() => {
    visitFixturePage("forms");
  });

  it("getGoaCheckboxList yields the list host", () => {
    getGoaCheckboxList("Toppings").should("have.prop", "tagName", "GOA-CHECKBOX-LIST");
  });

  it("checkGoaCheckboxList checks several items and the list reports them", () => {
    checkGoaCheckboxList("Toppings", ["Olives", "Onions"]);
    getGoaCheckbox("Olives").should("be.checked");
    getGoaCheckbox("Onions").should("be.checked");
    getGoaCheckbox("Cheese").should("not.be.checked");
    cy.get('[data-testid="toppings-value"]').should("have.text", '["olives","onions"]');
  });

  it("uncheckGoaCheckboxList removes an item from the selection", () => {
    checkGoaCheckboxList("Toppings", ["Cheese", "Olives"]);
    uncheckGoaCheckboxList("Toppings", "Cheese");
    cy.get('[data-testid="toppings-value"]').should("have.text", '["olives"]');
  });
});
