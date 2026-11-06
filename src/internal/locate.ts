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
  /** Extra CSS selector appended to the tag, for example `[data-cy="next"]`. */
  selector?: string;
  /**
   * Only match components inside this container, or the container itself when it is
   * the component (so `data-cy` can sit on a wrapper or on the host). A CSS selector,
   * an element, or a jQuery collection. `cy.within()` also scopes every helper.
   */
  within?: Scope;
}

/**
 * What a helper accepts to find its component: a plain string, which means the
 * component's natural key (form-item label for form controls, visible text for
 * buttons and the like), or a {@link GoaLocator}.
 */
export type Locator = string | GoaLocator;

export type NaturalKey = "label" | "text" | "none";

export function matchesText(actual: string | null | undefined, wanted: TextMatch): boolean {
  const value = normalizeText(actual);
  return wanted instanceof RegExp ? wanted.test(value) : value === normalizeText(wanted);
}

export function toLocator(locator: Locator | undefined, key: NaturalKey): GoaLocator {
  if (locator === undefined) return {};
  if (typeof locator !== "string") return locator;
  if (key === "none") return { selector: locator };
  return { [key]: locator };
}

function isWithin(el: Element, within: Scope): boolean {
  if (typeof within === "string") return el.closest(within) !== null;
  // Elements come from the application window, so `instanceof Element` cannot be used here.
  if ("nodeType" in within) return within === el || within.contains(el);
  return within.toArray().some((scope) => scope === el || scope.contains(el));
}

function tagSelector(tag: string, locator: GoaLocator): string {
  let selector = tag;
  if (locator.name !== undefined) selector += `[name="${cssAttrValue(locator.name)}"]`;
  if (locator.testid !== undefined) selector += `[testid="${cssAttrValue(locator.testid)}"]`;
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
  textOf: (el: Element) => string = (el) => normalizeText(el.textContent)
): Chainable {
  const loc = toLocator(locator, key);
  const selector = tagSelector(tag, loc);
  const within = loc.within;
  const scoped = (chain: Chainable): Chainable =>
    within === undefined ? chain : chain.filter((_, el) => isWithin(el, within));

  let hosts: Chainable;
  if (loc.label !== undefined) {
    const label = loc.label;
    const formItems = scoped(cy.get("goa-form-item")).filter((_, el) => matchesText(goaFormItemLabel(el), label));
    if (tag !== "goa-form-item") hosts = formItems.find(selector);
    else hosts = selector === tag ? formItems : formItems.filter(selector);
  } else {
    hosts = scoped(cy.get(selector));
  }

  if (loc.text !== undefined) {
    const text = loc.text;
    hosts = hosts.filter((_, el) => matchesText(textOf(el), text));
  }
  return hosts;
}
