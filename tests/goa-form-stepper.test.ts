import { getGoaFormStep, getGoaFormStepper, selectGoaFormStep } from "../src/components/goa-form-stepper";
import { visitFixturePage } from "./fixture-page";

describe("goa-form-stepper", () => {
  beforeEach(() => visitFixturePage("widgets"));

  it("selectGoaFormStep clicks a step and the stepper fires _change", () => {
    getGoaFormStepper().should("have.attr", "step", "2");
    getGoaFormStep("Personal details").should("have.attr", "status", "complete");
    selectGoaFormStep("Personal details");
    cy.get('[data-testid="events"]').should("contain.text", "stepper:_change:1");
  });
});
