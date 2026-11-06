import { clickShadowControl } from "../internal/actions";
import { findGoaHosts, Locator } from "../internal/locate";
import { normalizeText } from "../internal/text";

/**
 * Finds a goa-form-stepper. Yields the host; `step` is the current 1-based step.
 *
 * @param {Locator} [locator] - Extra selector or a locator object.
 * @example
 * getGoaFormStepper().should("have.attr", "step", "2");
 */
export function getGoaFormStepper(locator?: Locator): Cypress.Chainable<JQuery<HTMLElement>> {
  return findGoaHosts("goa-form-stepper", locator, "none");
}

/**
 * Finds a goa-form-step by its `text`. Yields the host; `status` is the step's status.
 *
 * @param {Locator} locator - Step text, or a locator object.
 * @example
 * getGoaFormStep("Personal details").should("have.attr", "status", "complete");
 */
export function getGoaFormStep(locator: Locator): Cypress.Chainable<JQuery<HTMLElement>> {
  return findGoaHosts("goa-form-step", locator, "text", (el) => normalizeText(el.getAttribute("text")));
}

/**
 * Clicks a goa-form-step. The stepper fires `_change` with the 1-based step number.
 * Steps the application has not enabled yet do not react.
 *
 * @param {Locator} locator - Step text, or a locator object.
 * @example
 * selectGoaFormStep("Personal details");
 */
export function selectGoaFormStep(locator: Locator): void {
  // The step button is a transparent overlay (opacity 0), so visibility cannot be required.
  clickShadowControl(getGoaFormStep(locator).shadow().find('button[data-testid="button"]'), { visible: false });
}
