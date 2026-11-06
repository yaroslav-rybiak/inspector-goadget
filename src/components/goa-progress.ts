import { findGoaHosts, Locator } from "../internal/locate";
import { normalizeText } from "../internal/text";

/**
 * Finds a goa-linear-progress. Yields the shadow element with `role="progressbar"`, whose
 * `aria-valuenow` is the current percentage (absent while indeterminate).
 *
 * @param {Locator} [locator] - Extra selector or a locator object.
 * @example
 * getGoaLinearProgress().should("have.attr", "aria-valuenow", "40");
 */
export function getGoaLinearProgress(locator?: Locator): Cypress.Chainable<JQuery<HTMLElement>> {
  return findGoaHosts("goa-linear-progress", locator, "none").shadow().find('[role="progressbar"]');
}

/**
 * Finds a goa-circular-progress by its `message`. Yields the host; `visible` tells
 * whether it is shown and `progress` the percentage, when determinate.
 *
 * @param {Locator} [locator] - Message text, or a locator object (`{}` for the only one).
 * @example
 * getGoaCircularProgress("Loading files").should("have.attr", "visible", "true");
 */
export function getGoaCircularProgress(locator?: Locator): Cypress.Chainable<JQuery<HTMLElement>> {
  return findGoaHosts("goa-circular-progress", locator, "text", (el) => normalizeText(el.getAttribute("message")));
}
