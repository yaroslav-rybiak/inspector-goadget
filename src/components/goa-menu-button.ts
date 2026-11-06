import { clickShadowControl } from "../internal/actions";
import { goaOpen } from "../internal/attributes";
import { findGoaHosts, Locator, matchesText, requireOneGoaHost, TextMatch } from "../internal/locate";
import { normalizeText } from "../internal/text";

/**
 * Finds a goa-menu-button by its `text`. Yields the host; its goa-menu-action children
 * are in the light DOM.
 *
 * @param {Locator} locator - Menu button text, or a locator object (`{ icon: "ellipsis" }`
 * for icon-only menus).
 * @example
 * getGoaMenuButton("Assign next").find("goa-menu-action").should("have.length", 3);
 */
export function getGoaMenuButton(locator: Locator): Cypress.Chainable<JQuery<HTMLElement>> {
  return findGoaHosts("goa-menu-button", locator, "text", (el) => normalizeText(el.getAttribute("text")));
}

/**
 * Opens a goa-menu-button's menu by clicking its trigger.
 *
 * @param {Locator} locator - Menu button text, or a locator object.
 */
export function openGoaMenuButton(locator: Locator): void {
  requireOneGoaHost("openGoaMenuButton", "goa-menu-button", locator, "text", (el) => normalizeText(el.getAttribute("text")));
  clickShadowControl(getGoaMenuButton(locator).shadow().find("goa-button, goa-icon-button").shadow().find("button"));
  getGoaMenuButton(locator).shadow().find("goa-popover").should(goaOpen());
}

/**
 * Opens a goa-menu-button and clicks one of its goa-menu-action items by text. The
 * action fires `_action` on the menu button with its `action` name.
 *
 * @param {Locator} locator - Menu button text, or a locator object.
 * @param {string | RegExp} actionText - The `text` of the goa-menu-action.
 * @example
 * selectGoaMenuButton("Assign next", "Assign 5 files");
 */
export function selectGoaMenuButton(locator: Locator, actionText: TextMatch): void {
  requireOneGoaHost("selectGoaMenuButton", "goa-menu-button", locator, "text", (el) => normalizeText(el.getAttribute("text")));
  openGoaMenuButton(locator);
  clickShadowControl(
    getGoaMenuButton(locator)
      .find("goa-menu-action")
      .filter((_, el) => matchesText(el.getAttribute("text"), actionText))
      .shadow()
      .find("button")
  );
}
