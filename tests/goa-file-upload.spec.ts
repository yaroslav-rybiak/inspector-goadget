import { uploadFileToGoaInput } from "../src/components/goa-file-upload";

describe("Upload a file to goa-file-upload-input", () => {
  const testCases = [
    { label: "Upload a file", fileName: "ExampleFile.pdf" },
    { label: "Upload a file", fileName: "ExampleFile.jpg" },
    { label: "Upload a file", fileName: "ExampleFile.jpeg" },
    { label: "Upload a file", fileName: "ExampleFile.png" },
  ];

  testCases.forEach(({ label, fileName }) => {
    it(`Uploads an ${fileName} file using the "${label}" label`, () => {
      cy.visit("https://design.alberta.ca/components/file-uploader#tab-0");
      uploadFileToGoaInput(label, fileName);
      cy.get(`goa-form-item[label="${label}"]`)
        .find("goa-file-upload-card")
        .shadow()
        .find('div[data-testid="filename"]')
        .should("contain.text", fileName);
    });
  });
});
