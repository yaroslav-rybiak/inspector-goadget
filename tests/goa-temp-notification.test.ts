import { clickGoaButton } from "../src/components/goa-button";
import { clickGoaTempNotification, getGoaTempNotification } from "../src/components/goa-temp-notification";
import { visitFixturePage } from "./fixture-page";

describe("goa-temp-notification shown through the controller", () => {
  beforeEach(() => visitFixturePage("display"));

  it("getGoaTempNotification finds the snackbar inside the controller's shadow DOM", () => {
    clickGoaButton("Show temporary notification");
    getGoaTempNotification("Changes saved").should("exist").and("have.attr", "action-text", "Undo");
    getGoaTempNotification({ text: /saved/ }).should("have.length", 1);
  });

  it("clickGoaTempNotification runs the action", () => {
    clickGoaButton("Show temporary notification");
    clickGoaTempNotification("Changes saved");
    cy.get('[data-testid="events"]').should("contain.text", "temp:action");
  });
});
