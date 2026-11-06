import { clickShadowControl } from "../internal/actions";
import { findGoaHosts, Locator } from "../internal/locate";

/**
 * Finds a goa-pagination. Yields the host; `pagenumber` is the current page.
 *
 * @param {Locator} [locator] - Extra selector or a locator object, when there are several.
 * @example
 * getGoaPagination().should("have.attr", "pagenumber", "2");
 */
export function getGoaPagination(locator?: Locator): Cypress.Chainable<JQuery<HTMLElement>> {
  return findGoaHosts("goa-pagination", locator, "none");
}

/**
 * Moves a goa-pagination to another page. The component fires `_change` with `{ page }`.
 *
 * @param {number | "next" | "previous"} page - A page number, or `"next"` / `"previous"`.
 * @param {Locator} [locator] - Which pagination, when there are several.
 * @example
 * selectGoaPagination("next");
 * selectGoaPagination(3);
 */
export function selectGoaPagination(page: number | "next" | "previous", locator?: Locator): void {
  if (typeof page === "number") {
    const dropdown = () =>
      getGoaPagination(locator).shadow().find('[data-testid="page-selector"] goa-dropdown').shadow();
    dropdown().find('input[role="combobox"]').click();
    dropdown().find(`ul[role="listbox"] li[role="option"][data-value="${page}"]`).click();
    return;
  }
  const text = page === "next" ? "Next" : "Previous";
  clickShadowControl(
    getGoaPagination(locator)
      .shadow()
      .find('[data-testid="page-links"] goa-button')
      .filter((_, el) => (el.textContent ?? "").trim() === text)
      .shadow()
      .find("button")
  );
}
