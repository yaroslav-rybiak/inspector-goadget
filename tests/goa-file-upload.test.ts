import { uploadFileToGoaInput } from "../src/components/goa-file-upload";
import { visitFixturePage } from "./fixture-page";

describe("uploadFileToGoaInput", () => {
  const label = "Upload a file";
  const fileNames = [
    "ExampleFile.pdf",
    "ExampleFile.jpg",
    "ExampleFile.jpeg",
    "ExampleFile.png",
  ];

  beforeEach(() => {
    visitFixturePage();
  });

  fileNames.forEach((fileName) => {
    it(`uploads ${fileName} through the input labelled '${label}'`, () => {
      uploadFileToGoaInput(label, fileName);
      cy.get(`goa-form-item[label="${label}"]`)
        .find("goa-file-upload-card")
        .shadow()
        .find('div[data-testid="filename"]')
        .should("contain.text", fileName);
    });
  });
});
