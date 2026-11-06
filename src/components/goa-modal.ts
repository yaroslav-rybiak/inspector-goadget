import { clickShadowControl } from "../internal/actions";
import { attributeOrSlotText, findGoaHosts, Locator, requireOneGoaHost } from "../internal/locate";

/**
 * Finds a goa-modal by its heading (`heading` attribute or `slot="heading"`).
 *
 * Yields the host; `open="true"` means it is shown; assert it with `goaOpen()`. Its buttons are light-DOM
 * children, so `getGoaModal("Confirm").within(() => clickGoaButton("Yes"))` works.
 *
 * @param {Locator} locator - Modal heading, or a locator object (`{}` for the only modal).
 * @example
 * getGoaModal("Confirm submission").should(goaOpen());
 */
export function getGoaModal(locator: Locator): Cypress.Chainable<JQuery<HTMLElement>> {
  return findGoaHosts("goa-modal", locator, "text", (el) => attributeOrSlotText(el, "heading", "heading"));
}

/**
 * Closes a goa-modal through its close icon (requires `closable`). The component
 * fires `_close`; the application sets `open` to false in response.
 *
 * @param {Locator} locator - Modal heading, or a locator object.
 * @example
 * closeGoaModal("Confirm submission");
 */
export function closeGoaModal(locator: Locator): void {
  requireOneGoaHost("closeGoaModal", "goa-modal", locator, "text", (el) => attributeOrSlotText(el, "heading", "heading"));
  clickShadowControl(
    getGoaModal(locator).shadow().find('goa-icon-button[data-testid="modal-close-button"]').shadow().find("button")
  );
}
