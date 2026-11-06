import { goaOpen } from "../src/internal/attributes";
import { closeGoaPopover, getGoaPopover, openGoaPopover } from "../src/components/goa-popover";
import { visitFixturePage } from "./fixture-page";

describe("goa-popover", () => {
  beforeEach(() => visitFixturePage("widgets"));

  it("openGoaPopover and closeGoaPopover toggle the popover by its target", () => {
    openGoaPopover({ selector: "#popover" });
    getGoaPopover({ selector: "#popover" }).should(goaOpen()).and("contain.text", "Popover content");
    cy.get('[data-testid="events"]').should("contain.text", "popover:_open:{}");
    openGoaPopover({ selector: "#popover" }); // no-op when already open
    closeGoaPopover({ selector: "#popover" });
    getGoaPopover({ selector: "#popover" }).should(goaOpen(false));
  });
});
