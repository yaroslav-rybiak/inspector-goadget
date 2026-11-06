import { pickGoaCalendarDate } from "../internal/date";
import { getGoaFormItem } from "./goa-form-item";

function host(label: string): Cypress.Chainable<JQuery<HTMLElement>> {
  return getGoaFormItem(label).find("goa-date-picker");
}

/**
 * Finds the text input of a goa-date-picker by the label of its goa-form-item.
 *
 * Yields the read-only shadow `input` that displays the chosen date, for example
 * "November 25, 2026". The component reports the chosen date through `_change`
 * with `value` (a Date) and `valueStr` (`YYYY-MM-DD`).
 *
 * @param {string} label - The label of the goa-form-item that contains the date picker.
 * @example
 * getGoaDatePicker("Start date").should("have.value", "November 25, 2026");
 */
export function getGoaDatePicker(label: string): Cypress.Chainable<JQuery<HTMLInputElement>> {
  return host(label).shadow().find("goa-input").shadow().find("input");
}

/**
 * Picks a date in a goa-date-picker through its calendar.
 *
 * The picker's input is read-only, so the date cannot be typed. This opens the
 * calendar, selects month and year, and clicks the day.
 *
 * @param {string} label - The label of the goa-form-item that contains the date picker.
 * @param {Date | string} date - A Date, or a `YYYY-MM-DD` string.
 * @example
 * selectGoaDatePicker("Start date", "2026-11-25");
 */
export function selectGoaDatePicker(label: string, date: Date | string): void {
  getGoaDatePicker(label).click();
  host(label).shadow().find("goa-popover").invoke("attr", "open").should("not.eq", "false");
  pickGoaCalendarDate(() => host(label).shadow().find("goa-calendar"), date);
}
