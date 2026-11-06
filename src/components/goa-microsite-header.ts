import { findGoaHosts, Locator, requireOneGoaHost } from "../internal/locate";

/**
 * Finds a goa-microsite-header. Yields the host; `type` is alpha, beta or live.
 *
 * @param {Locator} [locator] - Extra selector or a locator object.
 * @example
 * getGoaMicrositeHeader().should("have.attr", "type", "beta");
 */
export function getGoaMicrositeHeader(locator?: Locator): Cypress.Chainable<JQuery<HTMLElement>> {
  return findGoaHosts("goa-microsite-header", locator, "none");
}

/**
 * Clicks the header's "feedback" link. With `feedbackurl` it is a plain link; with
 * `hasfeedbackhandler` the component fires `_feedbackClick` instead.
 *
 * @param {Locator} [locator] - Extra selector or a locator object.
 * @example
 * clickGoaMicrositeHeader();
 */
export function clickGoaMicrositeHeader(locator?: Locator): void {
  requireOneGoaHost("clickGoaMicrositeHeader", "goa-microsite-header", locator, "none");
  getGoaMicrositeHeader(locator)
    .shadow()
    .find('[data-testid="feedback"] a, [data-testid="feedback-click"] a')
    .click();
}
