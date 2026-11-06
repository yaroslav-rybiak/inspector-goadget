import { getGoaCalendar, selectGoaCalendar } from "../src/components/goa-calendar";
import { visitFixturePage } from "./fixture-page";

describe("goa-calendar", () => {
  beforeEach(() => {
    visitFixturePage("forms");
  });

  it("getGoaCalendar yields the calendar host", () => {
    getGoaCalendar().should("have.length", 1).and("have.prop", "tagName", "GOA-CALENDAR");
  });

  it("selectGoaCalendar picks a day in the displayed month", () => {
    selectGoaCalendar("2026-11-20");
    cy.get('[data-testid="appointment-value"]').should("have.text", "2026-11-20");
  });

  it("selectGoaCalendar navigates to another month and year", () => {
    selectGoaCalendar(new Date(2024, 1, 29));
    cy.get('[data-testid="appointment-value"]').should("have.text", "2024-02-29");
  });
});
