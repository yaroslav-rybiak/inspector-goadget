import { attributeOrSlotText, findGoaHosts, Locator, matchesText, TextMatch } from "../internal/locate";

/**
 * Finds a goa-tabs container. Yields the host.
 *
 * @param {Locator} [locator] - Extra selector or a locator object, when there are several.
 */
export function getGoaTabs(locator?: Locator): Cypress.Chainable<JQuery<HTMLElement>> {
  return findGoaHosts("goa-tabs", locator, "none");
}

/**
 * Finds a goa-tab panel by its heading (`heading` attribute or `slot="heading"`).
 * Yields the host; `open="true"` means it is the selected tab; assert it with `goaOpen()`.
 *
 * @param {Locator} locator - Tab heading, or a locator object.
 * @example
 * getGoaTab("Documents").should(goaOpen());
 */
export function getGoaTab(locator: Locator): Cypress.Chainable<JQuery<HTMLElement>> {
  return findGoaHosts("goa-tab", locator, "text", (el) => attributeOrSlotText(el, "heading", "heading"));
}

/**
 * Selects a tab by its heading. The goa-tabs component fires `_change` with the
 * 1-based tab index.
 *
 * @param {string | RegExp} heading - The tab heading.
 * @param {Locator} [tabs] - Which goa-tabs, when there are several.
 * @example
 * selectGoaTab("Documents");
 */
export function selectGoaTab(heading: TextMatch, tabs?: Locator): void {
  getGoaTabs(tabs)
    .shadow()
    .find('[role="tab"]')
    .filter((_, el) => matchesText(el.getAttribute("data-text") ?? el.textContent, heading))
    .click();
}
