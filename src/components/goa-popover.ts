import { goaOpen, isGoaOpen } from "../internal/attributes";
import { findGoaHosts, Locator } from "../internal/locate";

/**
 * Finds a goa-popover. Yields the host; `open="true"` means its content is shown.
 * The target and the content are light-DOM children, so `.within()` works.
 *
 * @param {Locator} [locator] - Extra selector or a locator object, when there are several.
 * @example
 * getGoaPopover({ testid: "help" }).should(goaOpen());
 */
export function getGoaPopover(locator?: Locator): Cypress.Chainable<JQuery<HTMLElement>> {
  return findGoaHosts("goa-popover", locator, "none");
}

function setOpen(locator: Locator | undefined, open: boolean): void {
  getGoaPopover(locator).then(($popover) => {
    if (isGoaOpen($popover) !== open) {
      // The target usually holds slotted text over a shadow button, which defeats the
      // browser hit test Cypress relies on; dispatch the click directly.
      cy.wrap($popover, { log: false }).find('[slot="target"]').click({ force: true });
    }
  });
  getGoaPopover(locator).should(goaOpen(open));
}

/**
 * Opens a goa-popover by clicking its target. Does nothing if it is already open.
 *
 * @param {Locator} [locator] - Which popover, when there are several.
 * @example
 * openGoaPopover();
 */
export function openGoaPopover(locator?: Locator): void {
  setOpen(locator, true);
}

/**
 * Closes a goa-popover by clicking its target. Does nothing if it is already closed.
 *
 * @param {Locator} [locator] - Which popover, when there are several.
 */
export function closeGoaPopover(locator?: Locator): void {
  setOpen(locator, false);
}
