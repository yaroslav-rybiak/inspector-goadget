import { findGoaHosts, Scope, TextMatch } from "../internal/locate";

export { goaFormItemLabel } from "../internal/form-item-label";

/**
 * Finds goa-form-item elements by their label.
 *
 * Matches the `label` attribute or the content of a `slot="label"` child. A string
 * matches exactly after collapsing whitespace; a RegExp is tested against the label.
 *
 * @param {string | RegExp} label - The visible label of the form item.
 * @param {object} [options] - `within`: only search inside this container.
 * @example
 * getGoaFormItem("First name").should("have.attr", "error", "");
 * getGoaFormItem(/^City/, { within: '[data-cy="address"]' });
 */
export function getGoaFormItem(
  label: TextMatch,
  options: { within?: Scope } = {}
): Cypress.Chainable<JQuery<HTMLElement>> {
  return findGoaHosts("goa-form-item", { label, within: options.within }, "label");
}
