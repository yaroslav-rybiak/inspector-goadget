import { clickShadowControl } from "../internal/actions";
import { findGoaHosts, Locator, matchesText, requireOneGoaHost, TextMatch } from "../internal/locate";
import { normalizeText } from "../internal/text";

const headingOf = (el: Element) => normalizeText(el.getAttribute("heading"));
const titleOf = (el: Element) => normalizeText(el.getAttribute("title"));

/**
 * Finds a goa-work-side-notification-panel by its `heading`. Yields the host; its
 * goa-work-side-notification-item children are light DOM.
 *
 * @param {Locator} [locator] - Panel heading, or a locator object (`{}` for the only panel).
 * @example
 * getGoaWorkSideNotificationPanel("Notifications").find("goa-work-side-notification-item").should("have.length", 3);
 */
export function getGoaWorkSideNotificationPanel(locator?: Locator): Cypress.Chainable<JQuery<HTMLElement>> {
  return findGoaHosts("goa-work-side-notification-panel", locator, "text", headingOf);
}

/**
 * Selects one of the panel's tabs (Unread, Urgent, All) by its heading. The panel's
 * `active-tab` attribute follows.
 *
 * @param {Locator} locator - Panel heading, or a locator object.
 * @param {string | RegExp} tab - The tab heading.
 * @example
 * selectGoaWorkSideNotificationPanel("Notifications", "All");
 */
export function selectGoaWorkSideNotificationPanel(locator: Locator, tab: TextMatch): void {
  requireOneGoaHost("selectGoaWorkSideNotificationPanel", "goa-work-side-notification-panel", locator, "text", headingOf);
  getGoaWorkSideNotificationPanel(locator)
    .shadow()
    .find("goa-tabs")
    .shadow()
    .find('[role="tab"]')
    .filter((_, el) => matchesText(el.getAttribute("data-text") ?? el.textContent, tab))
    .click();
}

/**
 * Clicks the panel's close icon. The panel fires `goa:work-side-notification-panel:closePopover`,
 * which the enclosing work-side-menu item listens for to close its popover.
 *
 * @param {Locator} locator - Panel heading, or a locator object.
 */
export function closeGoaWorkSideNotificationPanel(locator: Locator): void {
  requireOneGoaHost("closeGoaWorkSideNotificationPanel", "goa-work-side-notification-panel", locator, "text", headingOf);
  clickShadowControl(getGoaWorkSideNotificationPanel(locator).shadow().find("goa-icon-button").shadow().find("button"));
}

function clickFooterLink(helper: string, locator: Locator, text: TextMatch): void {
  requireOneGoaHost(helper, "goa-work-side-notification-panel", locator, "text", headingOf);
  clickShadowControl(
    getGoaWorkSideNotificationPanel(locator)
      .shadow()
      .find("goa-link-button")
      .filter((_, el) => matchesText(el.textContent, text))
      .shadow()
      .find("button")
  );
}

/**
 * Clicks the panel's "View all" link. The panel fires `_viewAll`.
 *
 * @param {Locator} locator - Panel heading, or a locator object.
 */
export function viewAllGoaWorkSideNotificationPanel(locator: Locator): void {
  clickFooterLink("viewAllGoaWorkSideNotificationPanel", locator, /^View all/i);
}

/**
 * Clicks the panel's "Mark all as read" link. The panel fires `_markAllRead`.
 *
 * @param {Locator} locator - Panel heading, or a locator object.
 */
export function markAllReadGoaWorkSideNotificationPanel(locator: Locator): void {
  clickFooterLink("markAllReadGoaWorkSideNotificationPanel", locator, /^Mark all/i);
}

/**
 * Finds a goa-work-side-notification-item by its `title`. Yields the host; `readstatus`,
 * `priority` and `timestamp` are attributes on it.
 *
 * @param {Locator} locator - Item title, or a locator object.
 * @example
 * getGoaWorkSideNotificationItem("Case 1001 reassigned").should("have.attr", "readstatus", "unread");
 */
export function getGoaWorkSideNotificationItem(locator: Locator): Cypress.Chainable<JQuery<HTMLElement>> {
  return findGoaHosts("goa-work-side-notification-item", locator, "text", titleOf);
}

/**
 * Clicks a notification item. The item fires `_click`; the application decides what to
 * open and whether to mark it read.
 *
 * @param {Locator} locator - Item title, or a locator object.
 * @example
 * clickGoaWorkSideNotificationItem("Case 1001 reassigned");
 */
export function clickGoaWorkSideNotificationItem(locator: Locator): void {
  requireOneGoaHost("clickGoaWorkSideNotificationItem", "goa-work-side-notification-item", locator, "text", titleOf);
  clickShadowControl(getGoaWorkSideNotificationItem(locator).shadow().find('[role="button"]'));
}
