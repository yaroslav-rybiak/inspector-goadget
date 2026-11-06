import { clickShadowControl } from "../internal/actions";
import { findGoaHosts, Locator, matchesText, requireOneGoaHost, TextMatch } from "../internal/locate";
import { normalizeText } from "../internal/text";

/**
 * Finds a goa-table. Yields the host; its `thead`, `tbody`, rows and cells are light DOM.
 *
 * @param {Locator} [locator] - Extra selector or a locator object, when there are several.
 * @example
 * getGoaTable().find("tbody tr").should("have.length", 3);
 */
export function getGoaTable(locator?: Locator): Cypress.Chainable<JQuery<HTMLElement>> {
  return findGoaHosts("goa-table", locator, "none");
}

/**
 * Finds a goa-data-grid (the keyboard-navigable wrapper around a goa-table). Yields the
 * host. Use `{ within: "goa-data-grid" }` on the table helpers to target its table.
 *
 * @param {Locator} [locator] - Extra selector or a locator object.
 */
export function getGoaDataGrid(locator?: Locator): Cypress.Chainable<JQuery<HTMLElement>> {
  return findGoaHosts("goa-data-grid", locator, "none");
}

/**
 * Finds a goa-table-sort-header by its visible column text. Yields the host, whose
 * `direction` attribute is `asc`, `desc` or `none`.
 *
 * @param {Locator} locator - Column text, or a locator object such as `{ name: "fileNumber" }`.
 * @example
 * getGoaTableSortHeader("Name").should("have.attr", "direction", "asc");
 */
export function getGoaTableSortHeader(locator: Locator): Cypress.Chainable<JQuery<HTMLElement>> {
  return findGoaHosts("goa-table-sort-header", locator, "text");
}

/**
 * Sorts a goa-table by clicking a column's goa-table-sort-header. Each click cycles the
 * direction; the table fires `_sort` with `{ sortBy, sortDir }` and the application
 * reorders the rows.
 *
 * @param {Locator} header - Column text, or a locator object such as `{ name: "fileNumber" }`.
 * @example
 * sortGoaTable("Name");
 * sortGoaTable({ name: "name", within: "@files" });
 */
export function sortGoaTable(header: Locator): void {
  requireOneGoaHost("sortGoaTable", "goa-table-sort-header", header, "text");
  clickShadowControl(getGoaTableSortHeader(header).shadow().find("button"));
}

function cellMatches(cell: Element, text: TextMatch): boolean {
  return matchesText(cell.textContent, text);
}

/**
 * Finds the body rows of a goa-table that have a cell matching `text`: a string matches a
 * cell's whole text (whitespace collapsed), a RegExp is tested against each cell. Yields
 * the `tr` element(s).
 *
 * @param {string | RegExp} text - Text of one cell in the row.
 * @param {Locator} [table] - Which table, when there are several.
 * @example
 * getGoaTableRow("1002").should("contain.text", "Jane Doe");
 * getGoaTableRow(/^Jane/).find("goa-button");
 */
export function getGoaTableRow(text: TextMatch, table?: Locator): Cypress.Chainable<JQuery<HTMLElement>> {
  return getGoaTable(table)
    .find("tbody tr")
    .filter((_, row) => Array.from(row.querySelectorAll("td, th")).some((cell) => cellMatches(cell, text)));
}

/**
 * Finds a cell of a goa-table by the text of a cell in its row and the heading of its
 * column. Yields the `td`.
 *
 * @param {string | RegExp} rowText - Text of one cell in the row (see getGoaTableRow).
 * @param {string | RegExp} columnHeading - Visible text of the column heading.
 * @param {Locator} [table] - Which table, when there are several.
 * @example
 * getGoaTableCell("1002", "Status").should("have.text", "Closed");
 */
export function getGoaTableCell(
  rowText: TextMatch,
  columnHeading: TextMatch,
  table?: Locator
): Cypress.Chainable<JQuery<HTMLElement>> {
  return getGoaTable(table).then(($table) => {
    const headings = Array.from($table[0].querySelectorAll("thead th")).map((th) => normalizeText(th.textContent));
    const index = headings.findIndex((heading) => matchesText(heading, columnHeading));
    expect(index, `column "${columnHeading}" among ${JSON.stringify(headings)}`).to.be.at.least(0);
    return getGoaTableRow(rowText, table).find("td, th").eq(index);
  });
}
