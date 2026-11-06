import { clickShadowControl } from "../internal/actions";
import { cssAttrValue } from "../internal/text";
import { getGoaFormItem } from "./goa-form-item";

/**
 * Finds a goa-file-upload-card by the label of its goa-form-item and the file name.
 *
 * Yields the goa-file-upload-card host element.
 *
 * @param {string} label - The label of the goa-form-item that contains the card.
 * @param {string} fileName - The card's `filename`.
 * @example
 * getGoaFileUploadCard("Proof of address", "bill.pdf").should("have.attr", "progress", "100");
 */
export function getGoaFileUploadCard(label: string, fileName: string): Cypress.Chainable<JQuery<HTMLElement>> {
  return getGoaFormItem(label).find(`goa-file-upload-card[filename="${cssAttrValue(fileName)}"]`);
}

/**
 * Clicks the action button of a goa-file-upload-card.
 *
 * While the upload is in progress the card fires `_cancel`; once uploaded it fires
 * `_delete`. The application decides what happens next, typically removing the card.
 *
 * @param {string} label - The label of the goa-form-item that contains the card.
 * @param {string} fileName - The card's `filename`.
 * @example
 * deleteGoaFileUploadCard("Proof of address", "bill.pdf");
 */
export function deleteGoaFileUploadCard(label: string, fileName: string): void {
  clickShadowControl(getGoaFileUploadCard(label, fileName).shadow().find("goa-button").shadow().find("button"));
}
