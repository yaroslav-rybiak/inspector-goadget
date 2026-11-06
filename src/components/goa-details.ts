import { findGoaHosts, Locator } from "../internal/locate";
import { normalizeText } from "../internal/text";

/**
 * Finds a goa-details by its `heading`. Yields the host.
 *
 * @param {Locator} locator - Details heading, or a locator object.
 * @example
 * getGoaDetails("Show more").should("exist");
 */
export function getGoaDetails(locator: Locator): Cypress.Chainable<JQuery<HTMLElement>> {
  return findGoaHosts("goa-details", locator, "text", (el) => normalizeText(el.getAttribute("heading")));
}

function setOpen(locator: Locator, open: boolean): void {
  const summary = () => getGoaDetails(locator).shadow().find("summary");
  summary().then(($summary) => {
    if (($summary.attr("aria-expanded") === "true") !== open) {
      cy.wrap($summary, { log: false }).click();
    }
  });
  summary().should("have.attr", "aria-expanded", String(open));
}

/**
 * Expands a goa-details. Does nothing if it is already open.
 *
 * @param {Locator} locator - Details heading, or a locator object.
 * @example
 * openGoaDetails("Show more");
 */
export function openGoaDetails(locator: Locator): void {
  setOpen(locator, true);
}

/**
 * Collapses a goa-details. Does nothing if it is already closed.
 *
 * @param {Locator} locator - Details heading, or a locator object.
 */
export function closeGoaDetails(locator: Locator): void {
  setOpen(locator, false);
}
