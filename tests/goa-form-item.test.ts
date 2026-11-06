import { getGoaFormItem } from "../src/components/goa-form-item";
import { fillGoaInput, getGoaInput } from "../src/components/goa-input";
import { itOn3, visitFixturePage } from "./fixture-page";

describe("getGoaFormItem", () => {
  beforeEach(() => {
    visitFixturePage("forms");
  });

  it("matches a form item labelled through the label attribute", () => {
    getGoaFormItem("Basic").should("have.length", 1).and("have.attr", "label", "Basic");
  });

  itOn3("matches a form item labelled through the label slot", () => {
    getGoaFormItem("Slotted input label")
      .should("have.length", 1)
      .find('[slot="label"]')
      .should("have.text", "Slotted input label");
  });

  it("ignores whitespace differences and does not match partial labels", () => {
    getGoaFormItem("  Slotted   input label ").should("have.length", 1);
    getGoaFormItem("Slotted").should("not.exist");
  });

  itOn3("lets label-based helpers work with slotted labels", () => {
    fillGoaInput("Slotted input label", "via slot");
    getGoaInput("Slotted input label").should("have.value", "via slot");
    cy.get('[data-testid="slotted-input-value"]').should("have.text", "via slot");
  });
});
