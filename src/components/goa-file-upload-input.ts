import { getGoaFormItem } from "./goa-form-item";

/**
 * Finds a goa-file-upload-input by the label of its goa-form-item.
 *
 * Yields the goa-file-upload-input host element.
 *
 * @param {string} label - The label of the goa-form-item that contains the uploader.
 * @example
 * getGoaFileUploadInput("Proof of address").should("have.attr", "accept", ".pdf");
 */
export function getGoaFileUploadInput(label: string): Cypress.Chainable<JQuery<HTMLElement>> {
  return getGoaFormItem(label).find("goa-file-upload-input");
}

/**
 * Uploads a file to a goa-file-upload-input by dropping it on the drag-and-drop area.
 *
 * Finds the goa-form-item with the given label, locates the goa-file-upload-input
 * inside it, drops the fixture file on it, then waits for the goa-file-upload-card
 * progress bar to appear and disappear.
 *
 * @param {string} label - The label of the goa-form-item that contains the uploader.
 * @param {string} fileName - A file in the Cypress fixtures folder (jpg, jpeg, png or pdf).
 * @example
 * uploadGoaFileUploadInput("Upload a file", "ExampleFile.pdf");
 */
export function uploadGoaFileUploadInput(label: string, fileName: string): void {
  const fileExtension = fileName.split(".").pop()?.toLowerCase();
  let fileType: string;

  switch (fileExtension) {
    case "jpg":
    case "jpeg":
      fileType = "image/jpeg";
      break;
    case "png":
      fileType = "image/png";
      break;
    case "pdf":
      fileType = "application/pdf";
      break;
    default:
      throw new Error(`Unsupported file type: ${fileExtension}`);
  }

  getGoaFileUploadInput(label)
    .shadow()
    .find('div[data-testid="dragdrop"]')
    .then((dragDropArea) => {
      cy.fixture(fileName, "binary")
        .then(Cypress.Blob.binaryStringToBlob)
        .then((fileContent) => {
          const file = new File([fileContent], fileName, { type: fileType });
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          dragDropArea[0].dispatchEvent(
            new DragEvent("drop", { dataTransfer })
          );
        });
    });

  getGoaFormItem(label)
    .find("goa-file-upload-card")
    .shadow()
    .find('div[data-testid="progress"]')
    .should("exist") // Wait for the progress bar to appear
    .then(() => {
      getGoaFormItem(label)
        .find("goa-file-upload-card")
        .shadow()
        .find('div[data-testid="progress"]')
        .should("not.exist"); // Wait for the progress bar to disappear
    });
}
