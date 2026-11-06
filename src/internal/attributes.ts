/**
 * Reads an attribute as written in the DOM.
 *
 * jQuery's `.attr()` treats `open` (and other HTML boolean attributes) specially and
 * returns the attribute name instead of its value, so GoA's `open="true"` / `open="false"`
 * cannot be read through jQuery or through Cypress's `have.attr` assertion.
 */
export function domAttr($el: JQuery<HTMLElement>, name: string): string | null {
  return $el[0]?.getAttribute(name) ?? null;
}

/**
 * True when the component is open. GoA components reflect `open` in two ways:
 * `open="true"` / `open="false"` (modal, popover, tabs, accordion) or as a bare boolean
 * attribute that is present when open and absent when closed (drawers).
 */
export function isGoaOpen($el: JQuery<HTMLElement>): boolean {
  const value = domAttr($el, "open");
  return value !== null && value !== "false";
}

/**
 * Assertion callback for `.should()`: passes when the component's `open` attribute is
 * `"true"` (or `"false"` with `expected = false`). Use it for goa-modal, goa-drawer,
 * goa-popover, goa-accordion, goa-tab and other components that reflect `open`.
 *
 * @example
 * getGoaModal("Confirm").should(goaOpen());
 * getGoaDrawer("Filters").should(goaOpen(false));
 */
export function goaOpen(expected = true): ($el: JQuery<HTMLElement>) => void {
  return ($el) => {
    expect(isGoaOpen($el), `open (attribute value: ${JSON.stringify(domAttr($el, "open"))})`).to.eq(expected);
  };
}
