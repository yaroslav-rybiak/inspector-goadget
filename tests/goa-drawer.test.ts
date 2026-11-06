import { goaOpen } from "../src/internal/attributes";
import { clickGoaButton } from "../src/components/goa-button";
import { closeGoaDrawer, getGoaDrawer } from "../src/components/goa-drawer";
import { closeGoaPushDrawer, getGoaPushDrawer } from "../src/components/goa-push-drawer";
import { visitFixturePage } from "./fixture-page";

describe("goa-drawer", () => {
  beforeEach(() => visitFixturePage("widgets"));

  it("opens, exposes its actions through within(), and closes", () => {
    clickGoaButton("Open drawer");
    getGoaDrawer("Filters").should(goaOpen());
    getGoaDrawer("Filters").within(() => clickGoaButton("Apply"));
    cy.get('[data-testid="events"]').should("contain.text", "drawer-apply:_click");
    getGoaDrawer("Filters").should(goaOpen(false));
  });

  it("closeGoaDrawer fires _close through the close icon", () => {
    clickGoaButton("Open drawer");
    closeGoaDrawer("Filters");
    getGoaDrawer("Filters").should(goaOpen(false));
  });

  it("closeGoaPushDrawer closes a goa-push-drawer", () => {
    clickGoaButton("Open push drawer");
    getGoaPushDrawer("Details").should(goaOpen());
    closeGoaPushDrawer("Details");
    getGoaPushDrawer("Details").should(goaOpen(false));
  });
});
