import { clickShadowControl } from "../internal/actions";
import { findGoaHosts, Locator, requireOneGoaHost } from "../internal/locate";
import { normalizeText } from "../internal/text";

// The controller sets `message` as a property, not an attribute, so read the rendered text too.
const messageOf = (el: Element) =>
  normalizeText(
    el.getAttribute("message") ||
      (el as Element & { message?: string }).message ||
      el.shadowRoot?.querySelector(".message")?.textContent
  );

/**
 * Finds a goa-temp-notification (snackbar) by its `message`, whether it was written into
 * the page or shown through the goa-temp-notification-ctrl, which renders it inside its
 * own shadow DOM. Yields the host.
 *
 * @param {Locator} [locator] - Message text, or a locator object.
 * @example
 * getGoaTempNotification("Changes saved").should("exist");
 */
export function getGoaTempNotification(locator?: Locator): Cypress.Chainable<JQuery<HTMLElement>> {
  return findGoaHosts("goa-temp-notification", locator, "text", messageOf, { includeShadowDom: true });
}

/**
 * Clicks the action button of a goa-temp-notification (its `actionText`, for example
 * "Undo"). The application's action callback runs.
 *
 * @param {Locator} [locator] - Message text, or a locator object.
 * @example
 * clickGoaTempNotification("Changes saved");
 */
export function clickGoaTempNotification(locator?: Locator): void {
  requireOneGoaHost("clickGoaTempNotification", "goa-temp-notification", locator, "text", messageOf, {
    includeShadowDom: true,
  });
  clickShadowControl(getGoaTempNotification(locator).shadow().find("goa-button").shadow().find("button"));
}
