import { setShadowChecked } from "../internal/actions";
import { findGoaHosts, Locator, matchesText, TextMatch } from "../internal/locate";
import { cssAttrValue, normalizeText } from "../internal/text";

/** The visible label of a goa-radio-item: its `label` attribute or its slotted content. */
export function goaRadioItemLabel(item: Element): string {
  const attribute = item.getAttribute("label");
  if (attribute && attribute.trim()) return normalizeText(attribute);
  return normalizeText(item.textContent);
}

/** How to pick a goa-radio-item: a string matches its label; an object can use `value`. */
export type RadioItemLocator = TextMatch | { label?: TextMatch; value?: string };

/**
 * Finds a goa-radio-group.
 *
 * A string is the label of the surrounding goa-form-item; see {@link Locator} for
 * other ways such as `{ name: "size" }`. Yields the goa-radio-group host element.
 * The component reports the selected value through the `_change` event.
 *
 * @param {Locator} locator - Form-item label, or a locator object.
 * @example
 * getGoaRadioGroup("Size").should("have.attr", "name", "size");
 */
export function getGoaRadioGroup(locator: Locator): Cypress.Chainable<JQuery<HTMLElement>> {
  return findGoaHosts("goa-radio-group", locator, "label");
}

/**
 * Finds the native radio input of one goa-radio-item inside a goa-radio-group.
 *
 * Yields the shadow `input[type="radio"]`, so `be.checked` works directly.
 *
 * @param {Locator} group - Form-item label of the group, or a locator object.
 * @param {RadioItemLocator} item - Item label, or `{ value: "m" }`.
 * @example
 * getGoaRadioItem("Size", "Medium").should("be.checked");
 * getGoaRadioItem({ within: '[data-cy="onBehalf"]' }, { value: "yes" });
 */
export function getGoaRadioItem(group: Locator, item: RadioItemLocator): Cypress.Chainable<JQuery<HTMLElement>> {
  const wanted = typeof item === "string" || item instanceof RegExp ? { label: item } : item;
  let selector = "goa-radio-item";
  if (wanted.value !== undefined) selector += `[value="${cssAttrValue(wanted.value)}"]`;
  let items = getGoaRadioGroup(group).find(selector);
  if (wanted.label !== undefined) {
    const label = wanted.label;
    items = items.filter((_, el) => matchesText(goaRadioItemLabel(el), label));
  }
  return items.shadow().find('input[type="radio"]');
}

/**
 * Selects one item in a goa-radio-group.
 *
 * @param {Locator} group - Form-item label of the group, or a locator object.
 * @param {RadioItemLocator} item - Item label, or `{ value: "m" }`.
 * @example
 * selectGoaRadioGroup("Size", "Medium");
 * selectGoaRadioGroup({ within: '[data-cy="onBehalf"]' }, { value: "yes" });
 */
export function selectGoaRadioGroup(group: Locator, item: RadioItemLocator): void {
  setShadowChecked(getGoaRadioItem(group, item), true);
}
