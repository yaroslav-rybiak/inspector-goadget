import { dismissGoaNotification, getGoaNotification } from "../src/components/goa-notification";
import { getGoaTempNotification } from "../src/components/goa-temp-notification";
import { visitFixturePage } from "./fixture-page";

describe("notifications", () => {
  beforeEach(() => visitFixturePage("widgets"));

  it("dismissGoaNotification fires _dismiss", () => {
    getGoaNotification("Information banner text").should("have.attr", "type", "information");
    dismissGoaNotification({ text: /banner/ });
    cy.get('[data-testid="events"]').should("contain.text", "notification:_dismiss:");
  });

  it("getGoaTempNotification matches the message", () => {
    getGoaTempNotification("Saved successfully").should("have.attr", "visible", "true");
  });
});
