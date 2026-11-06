import { clickShadowControl } from "../internal/actions";
import { findGoaHosts, Locator, requireOneGoaHost, TextMatch } from "../internal/locate";

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
 * combobox first (filterable dropdowns), after clearing any current value. The
 * component fires `_change` with the selected value.
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
    clearGoaDropdown(locator);
    getGoaDropdown(locator).click().type(options.filter);
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
