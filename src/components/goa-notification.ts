import { clickShadowControl } from "../internal/actions";
import { findGoaHosts, Locator } from "../internal/locate";

/**
 * Finds a goa-notification by its text. Yields the host.
 *
 * @param {Locator} [locator] - Notification text (exact) or a locator object such as
 * `{ text: /saved/i }` or `{ selector: '[type="emergency"]' }`.
 * @example
 * getGoaNotification({ text: /saved/i }).should("exist");
 */
export function getGoaNotification(locator?: Locator): Cypress.Chainable<JQuery<HTMLElement>> {
  return findGoaHosts("goa-notification", locator, "text");
}

/**
 * Dismisses a goa-notification through its close button. The component fires
 * `_dismiss` and hides itself.
 *
 * @param {Locator} [locator] - Notification text, or a locator object.
 * @example
 * dismissGoaNotification({ text: /saved/i });
 */
export function dismissGoaNotification(locator?: Locator): void {
  clickShadowControl(getGoaNotification(locator).shadow().find('button[aria-label="Close the notification"]'));
}
