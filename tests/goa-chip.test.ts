import { clickGoaChip, getGoaChip } from "../src/components/goa-chip";
import { getGoaFilterChip, removeGoaFilterChip } from "../src/components/goa-filter-chip";
import { visitFixturePage } from "./fixture-page";

describe("goa-chip and goa-filter-chip", () => {
  beforeEach(() => visitFixturePage("widgets"));

  it("clickGoaChip fires _click on the chip", () => {
    getGoaChip("Deletable chip").should("have.class", "deletable");
    clickGoaChip("Deletable chip");
    cy.get('[data-testid="events"]').should("contain.text", "deletable-chip:_click:");
  });

  it("removeGoaFilterChip clicks the remove icon and fires _click", () => {
    getGoaFilterChip("Filter chip").should("have.attr", "removable", "true");
    removeGoaFilterChip("Filter chip");
    cy.get('[data-testid="events"]').should("contain.text", "filter-chip:_click:");
  });
});
