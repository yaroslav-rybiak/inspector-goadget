import { normalizeText } from "./text";

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
