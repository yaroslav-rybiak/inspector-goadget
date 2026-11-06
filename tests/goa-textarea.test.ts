import { fillGoaTextarea, getGoaTextarea } from "../src/components/goa-textarea";
import { visitFixturePage } from "./fixture-page";

describe("goa-textarea", () => {
  beforeEach(() => {
    visitFixturePage("forms");
  });

  it("fillGoaTextarea types multi-line text into the textarea labelled 'Comments'", () => {
    fillGoaTextarea("Comments", "First line{enter}Second line");
    getGoaTextarea("Comments").should("have.value", "First line\nSecond line");
    cy.get('[data-testid="comments-value"]').should("have.text", "First line\nSecond line");
  });

  it("fillGoaTextarea replaces existing text", () => {
    fillGoaTextarea("Comments", "draft");
    fillGoaTextarea("Comments", "final");
    getGoaTextarea("Comments").should("have.value", "final");
  });
});
