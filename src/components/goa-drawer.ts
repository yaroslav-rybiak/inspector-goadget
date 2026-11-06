import { clickShadowControl } from "../internal/actions";
import { attributeOrSlotText, findGoaHosts, Locator, requireOneGoaHost } from "../internal/locate";

/**
 * Finds a goa-drawer by its heading (`heading` attribute or `slot="heading"`).
 * Yields the host; `open="true"` means it is shown; assert it with `goaOpen()`. Its content and action buttons are
 * light-DOM children, so `.within()` works.
 *
 * @param {Locator} locator - Drawer heading, or a locator object (`{}` for the only drawer).
 * @example
 * getGoaDrawer("Filters").should(goaOpen());
 */
export function getGoaDrawer(locator: Locator): Cypress.Chainable<JQuery<HTMLElement>> {
  return findGoaHosts("goa-drawer", locator, "text", (el) => attributeOrSlotText(el, "heading", "heading"));
}

/**
 * Closes a goa-drawer through its close icon. The component fires `_close`; the
 * application sets `open` to false in response.
 *
 * @param {Locator} locator - Drawer heading, or a locator object.
 * @example
 * closeGoaDrawer("Filters");
 */
export function closeGoaDrawer(locator: Locator): void {
  requireOneGoaHost("closeGoaDrawer", "goa-drawer", locator, "text", (el) => attributeOrSlotText(el, "heading", "heading"));
  clickShadowControl(
    getGoaDrawer(locator).shadow().find('goa-icon-button[data-testid="drawer-close-button"]').shadow().find("button")
  );
}
