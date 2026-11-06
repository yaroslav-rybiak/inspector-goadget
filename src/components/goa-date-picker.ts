import { pickGoaCalendarDate } from "../internal/date";
import { goaOpen } from "../internal/attributes";
import { findGoaHosts, Locator, requireOneGoaHost } from "../internal/locate";

function host(locator: Locator): Cypress.Chainable<JQuery<HTMLElement>> {
  return findGoaHosts("goa-date-picker", locator, "label");
}

/**
 * Finds the text input of a goa-date-picker.
 *
 * A string is the label of the surrounding goa-form-item; see {@link Locator} for
 * other ways. Yields the read-only shadow `input` that displays the chosen date, for
 * example "November 25, 2026". The component reports the chosen date through
 * `_change` with `value` (a Date) and `valueStr` (`YYYY-MM-DD`).
 *
 * @param {Locator} locator - Form-item label, or a locator object.
 * @example
 * getGoaDatePicker("Start date").should("have.value", "November 25, 2026");
 */
export function getGoaDatePicker(locator: Locator): Cypress.Chainable<JQuery<HTMLInputElement>> {
  return host(locator).shadow().find("goa-input").shadow().find("input");
}

/**
 * Picks a date in a goa-date-picker through its calendar.
 *
 * The picker's input is read-only, so the date cannot be typed. This opens the
 * calendar, selects month and year, and clicks the day.
 *
 * @param {Locator} locator - Form-item label, or a locator object.
 * @param {Date | string} date - A Date, or a `YYYY-MM-DD` string.
 * @example
 * selectGoaDatePicker("Start date", "2026-11-25");
 */
export function selectGoaDatePicker(locator: Locator, date: Date | string): void {
  requireOneGoaHost("selectGoaDatePicker", "goa-date-picker", locator, "label");
  getGoaDatePicker(locator).click();
  host(locator).shadow().find("goa-popover").should(goaOpen());
  pickGoaCalendarDate(() => host(locator).shadow().find("goa-calendar"), date);
}
