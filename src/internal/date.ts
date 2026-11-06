export interface CalendarDate {
  year: number;
  month: number; // 1-12
  day: number;
  iso: string; // YYYY-MM-DD
}

/** Accepts a Date (local calendar day) or an ISO `YYYY-MM-DD` string. */
export function toCalendarDate(date: Date | string): CalendarDate {
  let year: number;
  let month: number;
  let day: number;
  if (date instanceof Date) {
    year = date.getFullYear();
    month = date.getMonth() + 1;
    day = date.getDate();
  } else {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date.trim());
    if (!match) {
      throw new Error(`Expected a Date or a YYYY-MM-DD string, got "${date}"`);
    }
    year = Number(match[1]);
    month = Number(match[2]);
    day = Number(match[3]);
  }
  const pad = (n: number) => String(n).padStart(2, "0");
  return { year, month, day, iso: `${year}-${pad(month)}-${pad(day)}` };
}

/**
 * Picks a day in a goa-calendar: selects the month and year in the calendar's own
 * dropdowns, then clicks the day button.
 *
 * @param calendar - Function returning a chain that yields the goa-calendar host.
 */
export function pickGoaCalendarDate(
  calendar: () => Cypress.Chainable<JQuery<HTMLElement>>,
  date: Date | string
): void {
  const wanted = toCalendarDate(date);
  const dropdown = (testid: string) => calendar().shadow().find(`goa-dropdown[data-testid="${testid}"]`);
  for (const [testid, value] of [
    ["months", wanted.month],
    ["years", wanted.year],
  ] as const) {
    dropdown(testid).shadow().find('goa-popover input[role="combobox"]').click();
    dropdown(testid)
      .shadow()
      .find(`goa-popover ul[role="listbox"] li[role="option"][data-value="${value}"]`)
      .click();
  }
  calendar().shadow().find(`button[data-date="${wanted.iso}"]`).click();
}
