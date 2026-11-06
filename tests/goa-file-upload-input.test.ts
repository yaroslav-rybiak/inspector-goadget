import {
  getGoaFileUploadInput,
  uploadGoaFileUploadInput,
} from "../src/components/goa-file-upload-input";
import { getGoaFormItem } from "../src/components/goa-form-item";
import { visitFixturePage } from "./fixture-page";

describe("goa-file-upload-input", () => {
  const label = "Upload a file";
  const fileNames = ["ExampleFile.pdf", "ExampleFile.jpg", "ExampleFile.jpeg", "ExampleFile.png"];

  beforeEach(() => {
    visitFixturePage("forms");
  });

  it("getGoaFileUploadInput yields the uploader host", () => {
    getGoaFileUploadInput(label).should("have.prop", "tagName", "GOA-FILE-UPLOAD-INPUT");
  });

  fileNames.forEach((fileName) => {
    it(`uploadGoaFileUploadInput uploads ${fileName} through the input labelled '${label}'`, () => {
      uploadGoaFileUploadInput(label, fileName);
      getGoaFormItem(label)
        .find("goa-file-upload-card")
        .shadow()
        .find('div[data-testid="filename"]')
        .should("contain.text", fileName);
    });
  });
});
