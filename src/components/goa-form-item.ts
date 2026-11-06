import { normalizeText } from "../internal/text";

/**
 * Returns the label text of a goa-form-item, whether it was given through the
 * `label` attribute or a child with `slot="label"`.
 */
export function goaFormItemLabel(formItem: Element): string {
  const attribute = formItem.getAttribute("label");
  if (attribute && attribute.trim()) return normalizeText(attribute);
  const slotted = formItem.querySelector(':scope > [slot="label"]');
  return normalizeText(slotted?.textContent);
}

/**
 * Finds goa-form-item elements by their label.
 *
 * Matches the `label` attribute or the content of a `slot="label"` child. The
 * comparison is exact after collapsing whitespace.
 *
 * @param {string} label - The visible label of the form item.
 * @example
 * getGoaFormItem("First name").should("have.attr", "error", "");
 */
export function getGoaFormItem(label: string): Cypress.Chainable<JQuery<HTMLElement>> {
  const wanted = normalizeText(label);
  return cy
    .get("goa-form-item")
    .filter((_, el) => goaFormItemLabel(el) === wanted);
}
