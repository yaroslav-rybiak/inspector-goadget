import { findGoaHosts, Locator } from "../internal/locate";
import { normalizeText } from "../internal/text";

/**
 * Finds a goa-temp-notification (snackbar) by its `message`. Yields the host;
 * `visible="true"` means it is shown.
 *
 * @param {Locator} [locator] - Message text, or a locator object.
 * @example
 * getGoaTempNotification("Saved successfully").should("have.attr", "visible", "true");
 */
export function getGoaTempNotification(locator?: Locator): Cypress.Chainable<JQuery<HTMLElement>> {
  return findGoaHosts("goa-temp-notification", locator, "text", (el) => normalizeText(el.getAttribute("message")));
}
