import { clickShadowControl } from "../internal/actions";
import { findGoaHosts, Locator, toLocator } from "../internal/locate";
import { cssAttrValue } from "../internal/text";

/**
 * Finds a goa-file-upload-card by file name.
 *
 * The locator scopes the search the same way as for the uploader: a string is the
 * label of the surrounding goa-form-item, `{}` searches the whole page,
 * `{ within }` a container. Yields the goa-file-upload-card host element.
 *
 * @param {Locator} locator - Form-item label, or a locator object.
 * @param {string} fileName - The card's `filename`.
 * @example
 * getGoaFileUploadCard("Proof of address", "bill.pdf").should("have.attr", "progress", "100");
 */
export function getGoaFileUploadCard(locator: Locator, fileName: string): Cypress.Chainable<JQuery<HTMLElement>> {
  const loc = toLocator(locator, "label");
  return findGoaHosts(
    "goa-file-upload-card",
    { ...loc, selector: `${loc.selector ?? ""}[filename="${cssAttrValue(fileName)}"]` },
    "label"
  );
}

/**
 * Clicks the action button of a goa-file-upload-card.
 *
 * While the upload is in progress the card fires `_cancel`; once uploaded it fires
 * `_delete`. The application decides what happens next, typically removing the card.
 *
 * @param {Locator} locator - Form-item label, or a locator object.
 * @param {string} fileName - The card's `filename`.
 * @example
 * deleteGoaFileUploadCard("Proof of address", "bill.pdf");
 */
export function deleteGoaFileUploadCard(locator: Locator, fileName: string): void {
  clickShadowControl(getGoaFileUploadCard(locator, fileName).shadow().find("goa-button").shadow().find("button"));
}
