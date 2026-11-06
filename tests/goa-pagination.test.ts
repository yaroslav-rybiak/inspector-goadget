import { getGoaPagination, selectGoaPagination } from "../src/components/goa-pagination";
import { visitFixturePage } from "./fixture-page";

describe("goa-pagination", () => {
  beforeEach(() => visitFixturePage("widgets"));

  it("selectGoaPagination('next') fires _change with the next page", () => {
    getGoaPagination().should("have.attr", "pagenumber", "1");
    selectGoaPagination("next");
    cy.get('[data-testid="events"]').should("contain.text", 'pager:_change:{"page":2}');
  });

  it("selectGoaPagination(n) picks a page from the page dropdown", () => {
    selectGoaPagination(7);
    cy.get('[data-testid="events"]').should("contain.text", 'pager:_change:{"page":7}');
  });
});
