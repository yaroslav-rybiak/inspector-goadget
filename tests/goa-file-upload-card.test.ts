import {
  deleteGoaFileUploadCard,
  getGoaFileUploadCard,
} from "../src/components/goa-file-upload-card";
import { uploadGoaFileUploadInput } from "../src/components/goa-file-upload-input";
import { visitFixturePage } from "./fixture-page";

describe("goa-file-upload-card", () => {
  const label = "Upload a file";

  beforeEach(() => {
    visitFixturePage("forms");
    uploadGoaFileUploadInput(label, "ExampleFile.pdf");
  });

  it("getGoaFileUploadCard finds the card for an uploaded file", () => {
    getGoaFileUploadCard(label, "ExampleFile.pdf")
      .should("have.length", 1)
      .and("have.attr", "progress", "100");
    getGoaFileUploadCard(label, "Other.pdf").should("have.length", 0);
  });

  it("deleteGoaFileUploadCard fires _delete and the app removes the card", () => {
    deleteGoaFileUploadCard(label, "ExampleFile.pdf");
    cy.get('[data-testid="upload-events"]').should("have.text", "_delete ExampleFile.pdf");
    getGoaFileUploadCard(label, "ExampleFile.pdf").should("not.exist");
  });
});
