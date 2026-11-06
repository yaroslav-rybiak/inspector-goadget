import { clickShadowControl } from "../internal/actions";
import { findGoaHosts, Locator, requireOneGoaHost } from "../internal/locate";
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
  requireOneGoaHost("selectGoaFormStep", "goa-form-step", locator, "text", (el) => normalizeText(el.getAttribute("text")));
  const button = () => getGoaFormStep(locator).shadow().find('button[data-testid="button"]');
  // The stepper numbers its steps asynchronously after mount; until then a click
  // carries no step number. The button's aria-label gets "Step N of M" at that point.
  button().should("have.attr", "aria-label").and("match", /^Step \d+ of \d+/);
  // The step button is a transparent overlay (opacity 0), so visibility cannot be required.
  clickShadowControl(button(), { visible: false });
}
