import { clickShadowControl } from "../internal/actions";
import { goaOpen } from "../internal/attributes";
import { findGoaHosts, Locator, requireOneGoaHost, TextMatch } from "../internal/locate";
import { normalizeText } from "../internal/text";

function host(locator: Locator): Cypress.Chainable<JQuery<HTMLElement>> {
  return findGoaHosts("goa-dropdown", locator, "label");
}

/**
 * Finds the combobox input inside a goa-dropdown.
 *
 * A string is the label of the surrounding goa-form-item; see {@link Locator} for
 * other ways such as `{ name: "worker" }`. Yields the shadow `input[role="combobox"]`,
 * whose value is the text of the selected option. The goa-dropdown host's own `value`
 * property is not updated by the component, so assert on this input or listen for
 * `_change`.
 *
 * @param {Locator} locator - Form-item label, or a locator object.
 * @example
 * getGoaDropdown("Province").should("have.value", "Alberta");
 */
export function getGoaDropdown(locator: Locator): Cypress.Chainable<JQuery<HTMLElement>> {
  return host(locator).shadow().find('goa-popover input[role="combobox"]');
}

/**
 * Selects an option in a goa-dropdown by its visible text.
 *
 * Opens the dropdown and clicks the option. With `filter`, the text is typed into the
 * combobox first (filterable dropdowns), replacing any current text. The component
 * fires `_change` with the selected value.
 *
 * @param {Locator} locator - Form-item label, or a locator object.
 * @param {string | RegExp} optionText - Text of the option; a string matches if contained.
 * @param {object} [options] - `filter`: text to type before picking.
 * @example
 * selectGoaDropdown("Basic dropdown", "Red");
 * selectGoaDropdown({ name: "worker" }, /^Jane Doe,/, { filter: "Jane" });
 */
export function selectGoaDropdown(locator: Locator, optionText: TextMatch, options: { filter?: string } = {}): void {
  requireOneGoaHost("selectGoaDropdown", "goa-dropdown", locator, "label");
  if (options.filter !== undefined) {
    // Typing over the current text (select all first) filters without firing the
    // `_change` with an empty value that the clear icon would.
    getGoaDropdown(locator).click().type(`{selectall}${options.filter}`);
  } else {
    getGoaDropdown(locator).click();
  }
  host(locator)
    .shadow()
    .find('goa-popover ul[role="listbox"]')
    .contains('li[role="option"]', optionText)
    .click();
}

/**
 * Clears the current value of a filterable goa-dropdown through its clear icon.
 * Does nothing when the dropdown has no value.
 *
 * @param {Locator} locator - Form-item label, or a locator object.
 * @example
 * clearGoaDropdown({ name: "worker" });
 */
export function clearGoaDropdown(locator: Locator): void {
  requireOneGoaHost("clearGoaDropdown", "goa-dropdown", locator, "label");
  host(locator)
    .shadow()
    .then(($root) => {
      if ($root.find('goa-icon-button[data-testid="clear-icon"]').length) {
        clickShadowControl(
          host(locator).shadow().find('goa-icon-button[data-testid="clear-icon"]').shadow().find("button")
        );
      }
    });
}

/** One option of a goa-dropdown as rendered in its list. */
export interface GoaDropdownOption {
  /** The option's value (`goa-dropdown-item` `value`). */
  value: string;
  /** The option's visible text, whitespace collapsed. */
  text: string;
}

/**
 * Reads the options a goa-dropdown offers, without changing its selection.
 *
 * Opens the list (typing `filter` over the current text first, for filterable
 * dropdowns), collects the visible options in display order, then puts the original
 * text back and closes the list. No `_change` is fired. The "no results" row is not an
 * option.
 * Yields the option texts, or `{ value, text }` objects with `values: true`.
 *
 * @param {Locator} locator - Form-item label, or a locator object.
 * @param {object} [options] - `filter`: text to type first; `values`: yield objects.
 * @example
 * getGoaDropdownOptions("Province").should("include", "Alberta");
 * getGoaDropdownOptions({ name: "worker" }, { filter: "Jane" }).should("deep.equal", ["Jane Doe, CEC"]);
 * getGoaDropdownOptions({ name: "worker" }, { filter: viewer.name }).should("be.empty");
 * getGoaDropdownOptions("Province", { values: true }).should("deep.include", { value: "AB", text: "Alberta" });
 */
export function getGoaDropdownOptions(
  locator: Locator,
  options?: { filter?: string; values?: false }
): Cypress.Chainable<string[]>;
export function getGoaDropdownOptions(
  locator: Locator,
  options: { filter?: string; values: true }
): Cypress.Chainable<GoaDropdownOption[]>;
export function getGoaDropdownOptions(
  locator: Locator,
  options: { filter?: string; values?: boolean } = {}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- overloads give callers the precise type
): Cypress.Chainable<any> {
  requireOneGoaHost("getGoaDropdownOptions", "goa-dropdown", locator, "label");
  let originalText = "";
  if (options.filter !== undefined) {
    // Type over the current text rather than using the clear icon, which fires
    // `_change` with an empty value and so would change the selection.
    getGoaDropdown(locator).invoke({ log: false }, "val").then((value) => {
      originalText = String(value ?? "");
    });
    getGoaDropdown(locator).click().type(`{selectall}${options.filter}`);
  } else {
    getGoaDropdown(locator).click();
  }
  const listbox = () => host(locator).shadow().find('goa-popover ul[role="listbox"]');
  const popover = () => host(locator).shadow().find("goa-popover");
  listbox().should("exist");
  return listbox().then(($listbox) => {
    const found = $listbox
      .find('li[role="option"]')
      .not('[data-testid="dropdown-item-not-found"]')
      .filter((_, li) => Cypress.$(li).is(":visible"))
      .toArray()
      .map((li) => ({ value: li.getAttribute("data-value") ?? "", text: normalizeText(li.textContent) }));
    if (options.filter !== undefined) {
      // The component leaves the typed filter in the field; put the original text back.
      getGoaDropdown(locator).type(originalText ? `{selectall}${originalText}` : "{selectall}{backspace}", { log: false });
    }
    // Clicking the combobox again closes the list.
    getGoaDropdown(locator).click({ force: true, log: false });
    popover().should(goaOpen(false));
    return cy.wrap(options.values ? found : found.map((option) => option.text), { log: false });
  });
}
