import { pickGoaCalendarDate } from "../internal/date";

/**
 * Finds goa-calendar elements on the page.
 *
 * Yields the goa-calendar host element(s). Scope with `.within()` when a page has
 * more than one calendar. Calendars nested inside a goa-date-picker are not
 * matched; use the date-picker helpers for those.
 *
 * @example
 * getGoaCalendar().should("have.attr", "value", "2026-11-06");
 */
export function getGoaCalendar(): Cypress.Chainable<JQuery<HTMLElement>> {
  return cy.get("goa-calendar");
}

/**
 * Selects a day in a goa-calendar.
 *
 * Picks the month and year in the calendar's dropdowns, then clicks the day. The
 * component fires `_change` with the date as `YYYY-MM-DD`.
 *
 * @param {Date | string} date - A Date, or a `YYYY-MM-DD` string.
 * @example
 * selectGoaCalendar("2026-02-10");
 */
export function selectGoaCalendar(date: Date | string): void {
  pickGoaCalendarDate(getGoaCalendar, date);
}
