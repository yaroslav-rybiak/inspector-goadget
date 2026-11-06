import { setShadowChecked } from "../internal/actions";
import { normalizeText } from "../internal/text";
import { getGoaFormItem } from "./goa-form-item";

/** The visible label of a goa-radio-item: its `label` attribute or its slotted content. */
export function goaRadioItemLabel(item: Element): string {
  const attribute = item.getAttribute("label");
  if (attribute && attribute.trim()) return normalizeText(attribute);
  return normalizeText(item.textContent);
}

/**
 * Finds a goa-radio-group by the label of its goa-form-item.
 *
 * Yields the goa-radio-group host element. The component reports the selected value
 * through the `_change` event.
 *
 * @param {string} label - The label of the goa-form-item that contains the group.
 * @example
 * getGoaRadioGroup("Size").should("have.attr", "name", "size");
 */
export function getGoaRadioGroup(label: string): Cypress.Chainable<JQuery<HTMLElement>> {
  return getGoaFormItem(label).find("goa-radio-group");
}

/**
 * Finds the native radio input of one goa-radio-item inside a goa-radio-group.
 *
 * Yields the shadow `input[type="radio"]`, so `be.checked` works directly.
 *
 * @param {string} label - The label of the goa-form-item that contains the group.
 * @param {string} itemLabel - The visible label of the radio item.
 * @example
 * getGoaRadioItem("Size", "Medium").should("be.checked");
 */
export function getGoaRadioItem(label: string, itemLabel: string): Cypress.Chainable<JQuery<HTMLElement>> {
  const wanted = normalizeText(itemLabel);
  return getGoaRadioGroup(label)
    .find("goa-radio-item")
    .filter((_, el) => goaRadioItemLabel(el) === wanted)
    .shadow()
    .find('input[type="radio"]');
}

/**
 * Selects one item in a goa-radio-group by the item's visible label.
 *
 * @param {string} label - The label of the goa-form-item that contains the group.
 * @param {string} itemLabel - The visible label of the radio item to select.
 * @example
 * selectGoaRadioGroup("Size", "Medium");
 */
export function selectGoaRadioGroup(label: string, itemLabel: string): void {
  setShadowChecked(getGoaRadioItem(label, itemLabel), true);
}
