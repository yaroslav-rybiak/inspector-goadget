import { clickShadowControl } from "../internal/actions";
import { findGoaHosts, Locator, requireOneGoaHost } from "../internal/locate";
import { normalizeText } from "../internal/text";

/** The accessible name of a goa-icon-button: its `arialabel`, or its `icon` name as a fallback. */
export function goaIconButtonText(button: Element): string {
  return normalizeText(button.getAttribute("arialabel") || button.getAttribute("icon"));
}

/**
 * Finds the native button inside a goa-icon-button.
 *
 * A string matches the `arialabel`, or the `icon` name when there is no aria label.
 * Other ways: `{ icon: "trash" }`, `{ testid: "clear-icon" }`, `{ within }`. Yields the
 * shadow `button`.
 *
 * @param {Locator} locator - Aria label or icon name, or a locator object.
 * @example
 * getGoaIconButton("Delete row").should("not.be.disabled");
 */
export function getGoaIconButton(locator: Locator): Cypress.Chainable<JQuery<HTMLButtonElement>> {
  return findGoaHosts("goa-icon-button", locator, "text", goaIconButtonText).shadow().find("button");
}

/**
 * Clicks a goa-icon-button. The component fires `_click`.
 *
 * @param {Locator} locator - Aria label or icon name, or a locator object.
 * @example
 * clickGoaIconButton({ icon: "trash", within: '[data-cy="row-3"]' });
 */
export function clickGoaIconButton(locator: Locator): void {
  requireOneGoaHost("clickGoaIconButton", "goa-icon-button", locator, "text", goaIconButtonText);
  clickShadowControl(getGoaIconButton(locator));
}
