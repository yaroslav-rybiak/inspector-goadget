import { getGoaDatePicker, selectGoaDatePicker } from "../src/components/goa-date-picker";
import { visitFixturePage } from "./fixture-page";

describe("goa-date-picker", () => {
  beforeEach(() => {
    visitFixturePage("forms");
  });

  it("getGoaDatePicker yields the read-only display input", () => {
    getGoaDatePicker("Start date").should("have.value", "");
    getGoaDatePicker("Start date").should("have.attr", "readonly");
  });

  it("selectGoaDatePicker picks a date from an ISO string", () => {
    selectGoaDatePicker("Start date", "2026-11-25");
    getGoaDatePicker("Start date").should("have.value", "November 25, 2026");
    cy.get('[data-testid="start-value"]').should("have.text", "2026-11-25");
  });

  it("selectGoaDatePicker picks a date in another month and year from a Date", () => {
    selectGoaDatePicker("Start date", new Date(2025, 6, 1));
    getGoaDatePicker("Start date").should("have.value", "July 1, 2025");
    cy.get('[data-testid="start-value"]').should("have.text", "2025-07-01");
  });
});
