import { attributeOrSlotText, findGoaHosts, Locator } from "../internal/locate";

/**
 * Finds a goa-accordion by its heading (`heading` attribute or `slot="headingcontent"`).
 * Yields the host; `open="true"` means it is expanded; assert it with `goaOpen()`.
 *
 * @param {Locator} locator - Accordion heading, or a locator object.
 * @example
 * getGoaAccordion("Personal details").should(goaOpen());
 */
export function getGoaAccordion(locator: Locator): Cypress.Chainable<JQuery<HTMLElement>> {
  return findGoaHosts("goa-accordion", locator, "text", (el) => attributeOrSlotText(el, "heading", "headingcontent"));
}

function setOpen(locator: Locator, open: boolean): void {
  const summary = () => getGoaAccordion(locator).shadow().find("summary");
  summary().then(($summary) => {
    if (($summary.attr("aria-expanded") === "true") !== open) {
      cy.wrap($summary, { log: false }).click();
    }
  });
  summary().should("have.attr", "aria-expanded", String(open));
}

/**
 * Expands a goa-accordion. Does nothing if it is already open. Fires `_change`.
 *
 * @param {Locator} locator - Accordion heading, or a locator object.
 * @example
 * openGoaAccordion("Personal details");
 */
export function openGoaAccordion(locator: Locator): void {
  setOpen(locator, true);
}

/**
 * Collapses a goa-accordion. Does nothing if it is already closed. Fires `_change`.
 *
 * @param {Locator} locator - Accordion heading, or a locator object.
 */
export function closeGoaAccordion(locator: Locator): void {
  setOpen(locator, false);
}
