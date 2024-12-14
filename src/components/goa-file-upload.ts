/**
 * Uploads a file to a goa-file-upload-input element within a goa-form-item.
 *
 * This function finds the goa-form-item with the specified label,
 * locates the associated goa-file-upload-input element, and performs
 * a drag-and-drop upload of the provided file.
 *
 * @param {string} label - The label of the goa-form-item to locate.
 * @param {string} fileName - The name of the file to upload (must exist in the Cypress fixtures folder).
 * @example
 * uploadFileToGoaInput('Upload a file', 'ExampleFile.pdf');
 */
export function uploadFileToGoaInput(label: string, fileName: string): void {
  // Determine the file type based on the file extension
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

  cy.get(`goa-form-item[label="${label}"]`)
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

  cy.get(`goa-form-item[label="${label}"]`)
    .find("goa-file-upload-card")
    .shadow()
    .find('div[data-testid="progress"]')
    .should("exist") // Wait for the progress bar to appear
    .then(() => {
      cy.get(`goa-form-item[label="${label}"]`)
        .find("goa-file-upload-card")
        .shadow()
        .find('div[data-testid="progress"]')
        .should("not.exist"); // Wait for the progress bar to disappear
    });
}
