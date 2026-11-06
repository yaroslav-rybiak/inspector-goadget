import { pickGoaCalendarDate } from "../internal/date";
import { findGoaHosts, Locator } from "../internal/locate";

/**
 * Finds goa-calendar elements.
 *
 * Without arguments, every goa-calendar in the light DOM. A string is treated as an
 * extra CSS selector, e.g. `[name="appointment"]`; a locator object works too. Yields
 * the host element(s). Calendars nested inside a goa-date-picker are not matched; use
 * the date-picker helpers for those.
 *
 * @param {Locator} [locator] - Extra selector or a locator object.
 * @example
 * getGoaCalendar().should("have.attr", "value", "2026-11-06");
 */
export function getGoaCalendar(locator?: Locator): Cypress.Chainable<JQuery<HTMLElement>> {
  return findGoaHosts("goa-calendar", locator, "none");
}

/**
 * Selects a day in a goa-calendar.
 *
 * Picks the month and year in the calendar's dropdowns, then clicks the day. The
 * component fires `_change` with the date as `YYYY-MM-DD`.
 *
 * @param {Date | string} date - A Date, or a `YYYY-MM-DD` string.
 * @param {Locator} [locator] - Extra selector or a locator object, when there are several calendars.
 * @example
 * selectGoaCalendar("2026-02-10");
 */
export function selectGoaCalendar(date: Date | string, locator?: Locator): void {
  pickGoaCalendarDate(() => getGoaCalendar(locator), date);
}
