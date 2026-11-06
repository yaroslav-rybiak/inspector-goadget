import { clickShadowControl } from "../internal/actions";
import { attributeOrSlotText, findGoaHosts, Locator } from "../internal/locate";

/**
 * Finds a goa-push-drawer by its heading (`heading` attribute or `slot="heading"`).
 * Yields the host; `open="true"` means it is shown; assert it with `goaOpen()`.
 *
 * @param {Locator} locator - Drawer heading, or a locator object (`{}` for the only one).
 * @example
 * getGoaPushDrawer("Details").should(goaOpen());
 */
export function getGoaPushDrawer(locator: Locator): Cypress.Chainable<JQuery<HTMLElement>> {
  return findGoaHosts("goa-push-drawer", locator, "text", (el) => attributeOrSlotText(el, "heading", "heading"));
}

/**
 * Closes a goa-push-drawer through its close icon. The component fires `_close`; the
 * application sets `open` to false in response.
 *
 * @param {Locator} locator - Drawer heading, or a locator object.
 * @example
 * closeGoaPushDrawer("Details");
 */
export function closeGoaPushDrawer(locator: Locator): void {
  clickShadowControl(
    getGoaPushDrawer(locator)
      .find('goa-icon-button[data-testid="drawer-close-button"]', { includeShadowDom: true })
      .shadow()
      .find("button")
  );
}
