import { goaConfig } from "./config";
import { cssAttrValue, normalizeText } from "./text";
import { goaFormItemLabel } from "./form-item-label";

export type Chainable = Cypress.Chainable<JQuery<HTMLElement>>;

/** A container to search in: a CSS selector, an element, or a jQuery collection. */
export type Scope = string | HTMLElement | JQuery<HTMLElement>;

/** A text to match: exact after collapsing whitespace, or a regular expression. */
export type TextMatch = string | RegExp;

/**
 * Describes how to find a component. Every field is optional and they combine:
 * `{ label: "City", within: "#step-2" }` finds the control labelled "City" inside `#step-2`.
 */
export interface GoaLocator {
  /** Label of the surrounding goa-form-item, from its `label` attribute or `slot="label"` child. */
  label?: TextMatch;
  /** Visible text of the component itself (buttons, checkboxes, chips, menu actions). */
  text?: TextMatch;
  /** The component's `name` attribute. */
  name?: string;
  /** The component's `testid` attribute. */
  testid?: string;
  /** The component's `icon` attribute (icon buttons, menu actions, side-menu groups). */
  icon?: string;
  /** Extra CSS selector appended to the tag, for example `[data-cy="next"]`. */
  selector?: string;
  /**
   * How long to wait for the component to appear, in milliseconds, instead of
   * `defaultCommandTimeout`. Applies to finding and upgrading the host element.
   */
  timeout?: number;
  /**
   * Only match components inside this container, or the container itself when it is
   * the component (so `data-cy` can sit on a wrapper or on the host). A selector
   * string (CSS plus jQuery extensions such as `:first`), an element, or a jQuery
   * collection. A string is re-queried on every retry; an element or collection is
   * not, so it goes stale when the page re-renders. `cy.within()` also scopes every
   * helper.
   */
  within?: Scope;
}

/**
 * What a helper accepts to find its component: a plain string, which means the
 * component's natural key (form-item label for form controls, visible text for
 * buttons and the like), a string starting with `@`, which means "inside the element
 * whose test attribute has that value" (`"@next"` is `{ within: '[data-cy="next"]' }`,
 * see `configureGoa`), or a {@link GoaLocator}.
 */
export type Locator = string | GoaLocator;

export type NaturalKey = "label" | "text" | "none";

export function matchesText(actual: string | null | undefined, wanted: TextMatch): boolean {
  const value = normalizeText(actual);
  return wanted instanceof RegExp ? wanted.test(value) : value === normalizeText(wanted);
}

function testIdSelector(id: string): string {
  return `[${goaConfig().testAttribute}="${cssAttrValue(id)}"]`;
}

export function toLocator(locator: Locator | undefined, key: NaturalKey): GoaLocator {
  if (locator === undefined) return {};
  if (typeof locator !== "string") {
    if (typeof locator.within === "string" && locator.within.startsWith("@")) {
      return { ...locator, within: testIdSelector(locator.within.slice(1)) };
    }
    return locator;
  }
  if (locator.startsWith("@")) return { within: testIdSelector(locator.slice(1)) };
  if (key === "none") return { selector: locator };
  return { [key]: locator };
}

/** Human-readable form of a locator for logs and failure messages. */
export function describeLocator(loc: GoaLocator): string {
  const parts: string[] = [];
  for (const [field, value] of Object.entries(loc)) {
    if (value === undefined) continue;
    let shown: string;
    if (value instanceof RegExp) shown = String(value);
    else if (typeof value === "string" || typeof value === "number") shown = JSON.stringify(value);
    else if (typeof value === "object" && "nodeType" in value) {
      const el = value as Element;
      shown = `<${el.tagName.toLowerCase()}${[...el.attributes].map((a) => ` ${a.name}="${a.value}"`).join("")}>`;
    } else shown = `jQuery(${(value as JQuery).length})`;
    parts.push(`${field}: ${shown}`);
  }
  return parts.length ? `{${parts.join(", ")}}` : "{}";
}

function isWithin(el: Element, within: Scope): boolean {
  if (typeof within === "string") {
    // Evaluated with jQuery on every retry, so jQuery-only selectors such as ":first"
    // or ":contains()" work and the container is re-queried after a re-render.
    return Cypress.$(within, el.ownerDocument)
      .toArray()
      .some((scope) => scope === el || scope.contains(el));
  }
  // Elements come from the application window, so `instanceof Element` cannot be used here.
  if ("nodeType" in within) return within === el || within.contains(el);
  return within.toArray().some((scope) => scope === el || scope.contains(el));
}

function tagSelector(tag: string, locator: GoaLocator): string {
  let selector = tag;
  if (locator.name !== undefined) selector += `[name="${cssAttrValue(locator.name)}"]`;
  if (locator.testid !== undefined) selector += `[testid="${cssAttrValue(locator.testid)}"]`;
  if (locator.icon !== undefined) selector += `[icon="${cssAttrValue(locator.icon)}"]`;
  if (locator.selector) selector += locator.selector;
  return selector;
}

/**
 * Finds the host element(s) of a component.
 *
 * @param tag - The custom element tag, e.g. `goa-input`.
 * @param locator - String (interpreted through `key`) or a {@link GoaLocator}.
 * @param key - What a plain string means for this component.
 * @param textOf - Extracts the component's visible text, used for `text` matching.
 */
export function findGoaHosts(
  tag: string,
  locator: Locator | undefined,
  key: NaturalKey,
  textOf: (el: Element) => string = (el) => normalizeText(el.textContent),
  options: { log?: boolean; includeShadowDom?: boolean } = {}
): Chainable {
  const loc = toLocator(locator, key);
  const selector = tagSelector(tag, loc);
  const within = loc.within;
  if (options.log !== false) {
    Cypress.log({ name: tag, message: describeLocator(loc), consoleProps: () => ({ tag, locator: loc }) });
  }
  // A retried assertion takes its timeout from the last query before it, so every
  // query in the chain gets the requested timeout.
  const opts: { timeout?: number; log?: boolean; includeShadowDom?: boolean } =
    loc.timeout === undefined ? {} : { timeout: loc.timeout };
  if (options.log === false) opts.log = false;
  // For components another component renders inside its own shadow root
  // (goa-temp-notification inside goa-temp-notification-ctrl).
  if (options.includeShadowDom) opts.includeShadowDom = true;
  const scoped = (chain: Chainable): Chainable =>
    within === undefined ? chain : chain.filter((_, el) => isWithin(el, within), opts);

  let hosts: Chainable;
  if (loc.label !== undefined) {
    const label = loc.label;
    const formItems = scoped(cy.get("goa-form-item", opts)).filter(
      (_, el) => matchesText(goaFormItemLabel(el), label),
      opts
    );
    if (tag !== "goa-form-item") hosts = formItems.find(selector, opts);
    else hosts = selector === tag ? formItems : formItems.filter(selector, opts);
  } else {
    hosts = scoped(cy.get(selector, opts));
  }

  if (loc.text !== undefined) {
    const text = loc.text;
    hosts = hosts.filter((_, el) => matchesText(textOf(el), text), opts);
  }

  if (loc.timeout !== undefined) {
    // Wait, within the requested time, for the host to exist and to be upgraded to its
    // custom element (its shadow DOM is only there after the upgrade). Helpers then
    // continue into the shadow DOM under the default timeout.
    hosts = hosts.should(($hosts) => {
      expect($hosts.length, `${selector} found`).to.be.greaterThan(0);
      expect($hosts.toArray().every((el) => el.matches(":defined")), `${selector} upgraded`).to.eq(true);
    });
  }
  return hosts;
}

/**
 * Synchronous counterpart of {@link findGoaHosts}: the components matching a locator
 * under `root`, computed with jQuery. Used where Cypress's query chain cannot carry a
 * custom message (an empty `.filter()` fails before any chained assertion runs).
 */
function queryDeep(root: Element | Document | ShadowRoot, selector: string): Element[] {
  const found = Array.from(root.querySelectorAll(selector));
  for (const el of Array.from(root.querySelectorAll("*"))) {
    if (el.shadowRoot) found.push(...queryDeep(el.shadowRoot, selector));
  }
  return found;
}

export function matchGoaHosts(
  root: Element | Document,
  tag: string,
  loc: GoaLocator,
  textOf: (el: Element) => string = (el) => normalizeText(el.textContent),
  options: { includeShadowDom?: boolean } = {}
): Element[] {
  const selector = tagSelector(tag, loc);
  const within = loc.within;
  const query = (sel: string, from: Element | Document) =>
    options.includeShadowDom ? queryDeep(from, sel) : Cypress.$(sel, from).toArray();
  const scoped = (els: Element[]) => (within === undefined ? els : els.filter((el) => isWithin(el, within)));
  let hosts: Element[];
  if (loc.label !== undefined) {
    const label = loc.label;
    const formItems = scoped(Cypress.$("goa-form-item", root).toArray()).filter((el) =>
      matchesText(goaFormItemLabel(el), label)
    );
    if (tag !== "goa-form-item") hosts = formItems.flatMap((item) => Cypress.$(selector, item).toArray());
    else hosts = selector === tag ? formItems : formItems.filter((el) => el.matches(selector));
  } else {
    hosts = scoped(query(selector, root));
  }
  if (loc.text !== undefined) {
    const text = loc.text;
    hosts = hosts.filter((el) => matchesText(textOf(el), text));
  }
  return hosts;
}

/**
 * Asserts, with retries, that exactly one component matches, so that an action fails
 * with a message naming the helper, the tag and the locator instead of a generic
 * "found 0 elements" from somewhere down the shadow-DOM chain. Counts under `cy.root()`,
 * so `cy.within()` scopes it like every other helper.
 */
export function requireOneGoaHost(
  helper: string,
  tag: string,
  locator: Locator | undefined,
  key: NaturalKey,
  textOf?: (el: Element) => string,
  options: { includeShadowDom?: boolean } = {}
): void {
  const loc = toLocator(locator, key);
  const description = describeLocator(loc);
  const opts: { log: false; timeout?: number } = { log: false };
  if (loc.timeout !== undefined) opts.timeout = loc.timeout;
  cy.root(opts).should(($root) => {
    const found = matchGoaHosts($root[0], tag, loc, textOf, options).length;
    expect(found, `${helper}: expected exactly one ${tag} matching ${description}, found ${found}`).to.eq(1);
  });
}

/** Text of an attribute, or of a named slot child, or of the whole light DOM. */
export function attributeOrSlotText(el: Element, attribute: string, slot?: string): string {
  const value = el.getAttribute(attribute);
  if (value && value.trim()) return normalizeText(value);
  const slotted = slot ? el.querySelector(`:scope > [slot="${slot}"]`) : null;
  return normalizeText((slotted ?? el).textContent);
}
