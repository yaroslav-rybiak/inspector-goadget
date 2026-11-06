import { goaOpen } from "../src/internal/attributes";
import { clickGoaButton } from "../src/components/goa-button";
import { closeGoaModal, getGoaModal } from "../src/components/goa-modal";
import { visitFixturePage } from "./fixture-page";

describe("goa-modal", () => {
  beforeEach(() => {
    visitFixturePage("widgets");
    clickGoaButton("Open modal");
  });

  it("getGoaModal finds the modal by heading and reports open", () => {
    getGoaModal("Confirm submission").should(goaOpen());
    getGoaModal({ text: /^Confirm/ }).should("have.length", 1);
  });

  it("buttons inside the modal are reachable with within()", () => {
    getGoaModal("Confirm submission").within(() => {
      clickGoaButton("Yes, submit");
    });
    cy.get('[data-testid="events"]').should("contain.text", "modal-confirm:_click");
    getGoaModal("Confirm submission").should(goaOpen(false));
  });

  it("closeGoaModal fires _close through the close icon", () => {
    closeGoaModal("Confirm submission");
    getGoaModal("Confirm submission").should(goaOpen(false));
  });
});
