import { clickShadowControl } from "../internal/actions";
import { findGoaHosts, Locator } from "../internal/locate";
import { normalizeText } from "../internal/text";

/**
 * Finds the native button inside a goa-menu-action by its `text`. Yields the shadow
 * `button`. The menu must be open for the action to be visible.
 *
 * @param {Locator} locator - Action text, or a locator object.
 * @example
 * getGoaMenuAction("Assign 5 files").should("be.visible");
 */
export function getGoaMenuAction(locator: Locator): Cypress.Chainable<JQuery<HTMLButtonElement>> {
  return findGoaHosts("goa-menu-action", locator, "text", (el) => normalizeText(el.getAttribute("text")))
    .shadow()
    .find("button");
}

/**
 * Clicks a goa-menu-action inside an already open menu.
 *
 * @param {Locator} locator - Action text, or a locator object.
 * @example
 * clickGoaMenuAction({ within: '[data-cy="assign-next-5"]' });
 */
export function clickGoaMenuAction(locator: Locator): void {
  clickShadowControl(getGoaMenuAction(locator));
}
