import { findGoaHosts, Locator, requireOneGoaHost } from "../internal/locate";
import { normalizeText } from "../internal/text";

const contentOf = (el: Element) => normalizeText(el.getAttribute("content") || el.querySelector(':scope > [slot="content"]')?.textContent);

function host(locator: Locator): Cypress.Chainable<JQuery<HTMLElement>> {
  return findGoaHosts("goa-tooltip", locator, "text", contentOf);
}

/**
 * Finds a goa-tooltip by its `content`. Yields the shadow element with `role="tooltip"`,
 * whose `aria-hidden` is `"false"` while the tooltip is shown and whose text is the
 * tooltip content. The element the tooltip wraps is a light-DOM child of the host.
 *
 * @param {Locator} locator - Tooltip content, or a locator object.
 * @example
 * getGoaTooltip("Helpful tip").should("have.attr", "aria-hidden", "true");
 */
export function getGoaTooltip(locator: Locator): Cypress.Chainable<JQuery<HTMLElement>> {
  return host(locator).shadow().find('[role="tooltip"]');
}

/**
 * Shows a goa-tooltip as hovering its target would, and waits until it is shown.
 *
 * @param {Locator} locator - Tooltip content, or a locator object.
 * @example
 * showGoaTooltip("Helpful tip");
 * getGoaTooltip("Helpful tip").should("be.visible").and("have.text", "Helpful tip");
 */
export function showGoaTooltip(locator: Locator): void {
  requireOneGoaHost("showGoaTooltip", "goa-tooltip", locator, "text", contentOf);
  host(locator).shadow().find(".tooltip").trigger("mouseenter", { force: true });
  getGoaTooltip(locator).should("have.attr", "aria-hidden", "false");
}

/**
 * Hides a goa-tooltip as moving the pointer away would, and waits until it is hidden.
 *
 * @param {Locator} locator - Tooltip content, or a locator object.
 */
export function hideGoaTooltip(locator: Locator): void {
  requireOneGoaHost("hideGoaTooltip", "goa-tooltip", locator, "text", contentOf);
  host(locator).shadow().find(".tooltip").trigger("mouseleave", { force: true });
  getGoaTooltip(locator).should("have.attr", "aria-hidden", "true");
}
