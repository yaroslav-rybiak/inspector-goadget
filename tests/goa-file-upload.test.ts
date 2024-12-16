import { uploadFileToGoaInput } from "../src/components/goa-file-upload";

describe("Upload a file to goa-file-upload-input", () => {
  const testCasesWithLabel = [
    { label: "Upload a file", fileName: "ExampleFile.pdf" },
    { label: "Upload a file", fileName: "ExampleFile.jpg" },
  ];

  const testCasesWithoutLabel = [
    { fileName: "ExampleFile.jpeg" },
    { fileName: "ExampleFile.png" },
  ];

  // Test cases with label
  testCasesWithLabel.forEach(({ fileName, label }) => {
    it(`Uploads a ${fileName} file using the "${label}" label`, () => {
      cy.visit("https://design.alberta.ca/components/file-uploader#tab-0");
      uploadFileToGoaInput(fileName, label);

      cy.get(`goa-form-item[label="${label}"]`)
        .find("goa-file-upload-card")
        .shadow()
        .find('div[data-testid="filename"]')
        .should("contain.text", fileName);
    });
  });

  // Test cases without label
  testCasesWithoutLabel.forEach(({ fileName }) => {
    it(`Uploads a ${fileName} file without a label`, () => {
      cy.visit("https://design.alberta.ca/components/file-uploader#tab-0");
      uploadFileToGoaInput(fileName);

      cy.get("goa-form-item")
        .first()
        .find("goa-file-upload-card")
        .shadow()
        .find('div[data-testid="filename"]')
        .should("contain.text", fileName);
    });
  });
});
