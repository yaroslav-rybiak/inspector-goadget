import { checkGoaCheckbox, getGoaCheckbox, uncheckGoaCheckbox } from "../src/components/goa-checkbox";
import { visitFixturePage } from "./fixture-page";

describe("goa-checkbox", () => {
  beforeEach(() => {
    visitFixturePage("forms");
  });

  it("checkGoaCheckbox checks a checkbox found by its text attribute", () => {
    getGoaCheckbox("I agree to the terms").should("not.be.checked");
    checkGoaCheckbox("I agree to the terms");
    getGoaCheckbox("I agree to the terms").should("be.checked");
    cy.get('[data-testid="terms-value"]').should("have.text", "checked:agreed");
  });

  it("uncheckGoaCheckbox unchecks a checkbox found by its slotted text", () => {
    getGoaCheckbox("Send me the newsletter").should("be.checked");
    uncheckGoaCheckbox("Send me the newsletter");
    getGoaCheckbox("Send me the newsletter").should("not.be.checked");
    cy.get('[data-testid="newsletter-value"]').should("have.text", "unchecked:");
  });

  it("checkGoaCheckbox leaves an already checked checkbox checked", () => {
    checkGoaCheckbox("Send me the newsletter");
    getGoaCheckbox("Send me the newsletter").should("be.checked");
    cy.get('[data-testid="newsletter-value"]').should("have.text", "");
  });
});
