import { clickGoaButton, getGoaButton } from "../src/components/goa-button";
import { clearGoaDropdown, getGoaDropdown, selectGoaDropdown } from "../src/components/goa-dropdown";
import { getGoaFormItem } from "../src/components/goa-form-item";
import { fillGoaInput, getGoaInput } from "../src/components/goa-input";
import { getGoaRadioItem, selectGoaRadioGroup } from "../src/components/goa-radio-group";
import { getGoaFileUploadInput, uploadGoaFileUploadInput } from "../src/components/goa-file-upload-input";
import { configureGoa } from "../src/internal/config";
import { visitFixturePage } from "./fixture-page";

describe("locators", () => {
  describe("on the buttons page", () => {
    beforeEach(() => {
      visitFixturePage("buttons");
    });

    it("a string matches the button text exactly; a RegExp can match partially", () => {
      getGoaButton("Submit and continue").should("have.length", 1);
      getGoaButton({ text: /^Submit/ }).should("have.length", 1);
      getGoaButton({ text: /submit/i }).should("have.length", 2);
    });

    it("absence is asserted on the host, because Cypress cannot traverse an empty match", () => {
      cy.get("goa-button").filter((_, el) => el.textContent?.trim() === "Submit").should("not.exist");
    });

    it("within scopes to a data-cy wrapper and needs no text", () => {
      clickGoaButton({ within: '[data-cy="next"]' });
      cy.get('[data-testid="last-clicked"]').should("have.text", "Next");
      getGoaButton({ within: '[data-cy="confirm"]', text: "Yes, submit application" }).should("have.length", 1);
    });

    it("cy.within() scopes helpers too", () => {
      cy.get('[data-cy="confirm"]').within(() => {
        clickGoaButton({});
      });
      cy.get('[data-testid="last-clicked"]').should("have.text", "Yes, submit application");
    });

    it("within strings accept jQuery selector extensions", () => {
      clickGoaButton({ within: "span[data-cy]:first" });
      cy.get('[data-testid="last-clicked"]').should("have.text", "Next");
      getGoaButton({ within: 'span:contains("application")' }).should("have.length", 1);
    });

    it("testid and selector match host attributes", () => {
      getGoaButton({ testid: "next-btn" }).should("have.length", 1);
      getGoaButton({ selector: '[type="tertiary"]' }).should("have.length", 1);
    });

    it("within accepts an element or jQuery collection", () => {
      cy.get('[data-cy="next"]').then(($wrapper) => {
        getGoaButton({ within: $wrapper }).should("have.length", 1);
        getGoaButton({ within: $wrapper[0] }).should("have.length", 1);
      });
    });
  });

  describe("@id shorthand", () => {
    beforeEach(() => visitFixturePage("buttons"));
    afterEach(() => configureGoa({ testAttribute: "data-cy" }));

    it("a string starting with @ scopes to the element with that data-cy", () => {
      clickGoaButton("@next");
      cy.get('[data-testid="last-clicked"]').should("have.text", "Next");
      getGoaButton({ within: "@confirm" }).should("have.length", 1);
    });

    it("configureGoa changes the attribute the shorthand uses", () => {
      configureGoa({ testAttribute: "data-test" });
      getGoaButton("@alt-next").should("have.length", 1);
      clickGoaButton("@alt-next");
      cy.get('[data-testid="last-clicked"]').should("have.text", "Next");
    });
  });

  describe("failure messages", () => {
    beforeEach(() => visitFixturePage("buttons"));

    it("an action that matches nothing names the helper, tag and locator", (done) => {
      cy.on("fail", (error) => {
        expect(error.message).to.include(
          'clickGoaButton: expected exactly one goa-button matching {within: "[data-cy=\\"nope\\"]", timeout: 500}, found 0'
        );
        done();
        return false;
      });
      clickGoaButton({ within: '[data-cy="nope"]', timeout: 500 });
    });

    it("an action that matches several components says how many", (done) => {
      cy.on("fail", (error) => {
        expect(error.message).to.match(/clickGoaButton: expected exactly one goa-button matching \{within: "#button", timeout: 500\}, found [2-9]/);
        done();
        return false;
      });
      clickGoaButton({ within: "#button", timeout: 500 });
    });

    it("locators still yield every match and allow absence checks on hosts", () => {
      getGoaButton({ within: "#button" }).should("have.length.greaterThan", 2);
      getGoaFormItem("nothing here").should("not.exist");
    });
  });

  describe("timeout", () => {
    let defaultTimeout: number;
    beforeEach(() => {
      defaultTimeout = Cypress.config("defaultCommandTimeout");
      visitFixturePage("buttons");
      Cypress.config("defaultCommandTimeout", 500);
    });
    afterEach(() => {
      Cypress.config("defaultCommandTimeout", defaultTimeout);
    });

    it("waits for a component that appears later than defaultCommandTimeout", () => {
      clickGoaButton({ within: '[data-cy="late"]', timeout: 5000 });
      cy.get('[data-testid="last-clicked"]').should("have.text", "Late button");
    });

    it("applies to the label path and to getGoaFormItem", () => {
      getGoaFormItem("Late input", { timeout: 5000 }).should("have.length", 1);
      fillGoaInput({ label: "Late input", timeout: 5000 }, "late");
      getGoaInput({ name: "late" }).should("have.value", "late");
    });
  });

  describe("on the forms page", () => {
    beforeEach(() => {
      visitFixturePage("forms");
    });

    it("form items match by RegExp and within", () => {
      getGoaFormItem(/^Basic/).should("have.length", 2);
      getGoaFormItem(/^Basic/, { within: '[data-cy="basic-wrapper"]' }).should("have.length", 1);
    });

    it("name locates a control without a label", () => {
      fillGoaInput({ name: "basic" }, "by name");
      getGoaInput("Basic").should("have.value", "by name");
    });

    it("label and within combine", () => {
      fillGoaInput({ label: "Basic", within: '[data-cy="basic-wrapper"]' }, "scoped");
      getGoaInput({ within: '[data-cy="basic-wrapper"]' }).should("have.value", "scoped");
    });

    it("radio items can be picked by value inside a data-cy group", () => {
      selectGoaRadioGroup({ within: '[data-cy="size-group"]' }, { value: "l" });
      getGoaRadioItem({ name: "size" }, { value: "l" }).should("be.checked");
      cy.get('[data-testid="size-value"]').should("have.text", "l");
    });

    it("dropdowns can be located by testid and options by RegExp", () => {
      selectGoaDropdown({ testid: "colour-dd" }, /^Gre/);
      getGoaDropdown({ name: "colour" }).should("have.value", "Green");
    });

    it("filterable dropdowns can be cleared and filtered", () => {
      selectGoaDropdown("Filterable dropdown", "John Doe, SFSC");
      getGoaDropdown({ name: "worker" }).should("have.value", "John Doe, SFSC");
      selectGoaDropdown({ name: "worker" }, /^Jane Doe,/, { filter: "Jane" });
      getGoaDropdown({ name: "worker" }).should("have.value", "Jane Doe, CEC");
      cy.get('[data-testid="worker-value"]').should("have.text", "1");
      clearGoaDropdown({ name: "worker" });
      getGoaDropdown({ name: "worker" }).should("have.value", "");
    });

    it("uploaders accept waitFor as a selector or a callback", () => {
      uploadGoaFileUploadInput({ within: '[data-cy="bare-uploader"]' }, "ExampleFile.jpg", {
        waitFor: '[data-testid="upload-events"]:contains("bare ExampleFile.jpg")',
      });
      let waited = false;
      uploadGoaFileUploadInput({ within: '[data-cy="bare-uploader"]' }, "ExampleFile.pdf", {
        waitFor: () => {
          cy.get('[data-testid="upload-events"]')
            .should("have.text", "bare ExampleFile.pdf")
            .then(() => (waited = true));
        },
      });
      cy.then(() => expect(waited).to.eq(true));
    });

    it("uploaders outside a form item work with within and waitForCard: false", () => {
      getGoaFileUploadInput({ within: '[data-cy="bare-uploader"]' }).should("have.length", 1);
      uploadGoaFileUploadInput({ within: '[data-cy="bare-uploader"]' }, "ExampleFile.png", { waitForCard: false });
      cy.get('[data-testid="upload-events"]').should("have.text", "bare ExampleFile.png");
    });
  });
});
