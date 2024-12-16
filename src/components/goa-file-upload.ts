/**
 * Uploads a file to a goa-file-upload-input element within a goa-form-item.
 *
 * If a label is provided, the function will locate the associated goa-form-item
 * with the specified label. If no label is provided, it will attempt to find
 * the first available goa-form-item and perform the file upload there.
 *
 * @param {string} [label] - The optional label of the goa-form-item to locate.
 * @param {string} fileName - The name of the file to upload (must exist in the Cypress fixtures folder).
 * @example
 * // Specify the label and file name
 * uploadFileToGoaInput('Upload a file', 'ExampleFile.pdf');
 *
 * // Only specify the file name (uses the first available goa-form-item)
 * uploadFileToGoaInput(undefined, 'ExampleFile.pdf');
 */
export function uploadFileToGoaInput(fileName: string, label?: string): void {
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

  // Determine the selector based on whether the label is provided
  const goaFormItemSelector = label
    ? `goa-form-item[label="${label}"]`
    : "goa-form-item";

  cy.get(goaFormItemSelector)
    .find("goa-file-upload-input")
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

  cy.get(goaFormItemSelector)
    .find("goa-file-upload-card")
    .shadow()
    .find('div[data-testid="progress"]')
    .should("exist") // Wait for the progress bar to appear
    .then(() => {
      cy.get(goaFormItemSelector)
        .find("goa-file-upload-card")
        .shadow()
        .find('div[data-testid="progress"]')
        .should("not.exist"); // Wait for the progress bar to disappear
    });
}
