import { findGoaHosts, Locator, requireOneGoaHost } from "../internal/locate";
import { getGoaFileUploadCard } from "./goa-file-upload-card";

/**
 * Finds a goa-file-upload-input.
 *
 * A string is the label of the surrounding goa-form-item. Pass `{}` when the page has
 * a single uploader outside a form item, or `{ within: '[data-cy="documents"]' }`.
 * Yields the goa-file-upload-input host element.
 *
 * @param {Locator} locator - Form-item label, or a locator object.
 * @example
 * getGoaFileUploadInput("Proof of address").should("have.attr", "accept", ".pdf");
 */
export function getGoaFileUploadInput(locator: Locator): Cypress.Chainable<JQuery<HTMLElement>> {
  return findGoaHosts("goa-file-upload-input", locator, "label");
}

function mimeType(fileName: string): string {
  const extension = fileName.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "pdf":
      return "application/pdf";
    default:
      throw new Error(`Unsupported file type: ${extension}`);
  }
}

/**
 * Uploads a file to a goa-file-upload-input by dropping it on the drag-and-drop area.
 *
 * Drops the fixture file on the uploader, then waits until the application has
 * rendered a goa-file-upload-card for that file whose progress bar is gone.
 * Applications that render their own upload UI instead of a card can pass `waitFor`:
 * a selector that must exist afterwards, or a callback that performs the wait. Pass
 * `waitForCard: false` to return right after the drop.
 *
 * @param {Locator} locator - Form-item label, or a locator object (`{}` for the only uploader).
 * @param {string} fileName - A file in the Cypress fixtures folder (jpg, jpeg, png or pdf).
 * @param {object} [options] - `waitFor`: selector or callback; `waitForCard` (default true).
 * @example
 * uploadGoaFileUploadInput("Upload a file", "ExampleFile.pdf");
 * uploadGoaFileUploadInput({ within: '[data-cy="documents"]' }, "leto/sin.jpg", {
 *   waitFor: '[data-cy="document-list"] li',
 * });
 */
export function uploadGoaFileUploadInput(
  locator: Locator,
  fileName: string,
  options: { waitForCard?: boolean; waitFor?: string | (() => void) } = {}
): void {
  requireOneGoaHost("uploadGoaFileUploadInput", "goa-file-upload-input", locator, "label");
  const fileType = mimeType(fileName);
  const baseName = fileName.split("/").pop() ?? fileName;

  getGoaFileUploadInput(locator)
    .shadow()
    .find('div[data-testid="dragdrop"]')
    .then((dragDropArea) => {
      cy.fixture(fileName, "binary")
        .then(Cypress.Blob.binaryStringToBlob)
        .then((fileContent) => {
          const file = new File([fileContent], baseName, { type: fileType });
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          dragDropArea[0].dispatchEvent(new DragEvent("drop", { dataTransfer }));
        });
    });

  if (typeof options.waitFor === "function") {
    options.waitFor();
    return;
  }
  if (typeof options.waitFor === "string") {
    cy.get(options.waitFor).should("exist");
    return;
  }
  if (options.waitForCard === false) return;
  // The file name is always rendered, so its presence proves the card has rendered;
  // then wait for the progress bar, if any, to go away.
  getGoaFileUploadCard(locator, baseName).shadow().find('[data-testid="filename"]').should("exist");
  getGoaFileUploadCard(locator, baseName).shadow().find('[data-testid="progress"]').should("not.exist");
}
