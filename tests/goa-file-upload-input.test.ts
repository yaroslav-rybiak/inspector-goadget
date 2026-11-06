import { uploadGoaFileUploadInput } from "../src/components/goa-file-upload-input";
import { visitFixturePage } from "./fixture-page";

describe("uploadGoaFileUploadInput", () => {
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
      uploadGoaFileUploadInput(label, fileName);
      cy.get(`goa-form-item[label="${label}"]`)
        .find("goa-file-upload-card")
        .shadow()
        .find('div[data-testid="filename"]')
        .should("contain.text", fileName);
    });
  });
});
