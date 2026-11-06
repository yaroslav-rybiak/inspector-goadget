import { clickGoaButton, getGoaButton } from "../src/components/goa-button";
import {
  getGoaDataGrid,
  getGoaTable,
  getGoaTableCell,
  getGoaTableRow,
  getGoaTableSortHeader,
  sortGoaTable,
} from "../src/components/goa-table";
import { visitFixturePage } from "./fixture-page";

describe("goa-table", () => {
  beforeEach(() => visitFixturePage("display"));

  it("getGoaTable and getGoaDataGrid yield the hosts", () => {
    getGoaTable().should("have.length", 2);
    getGoaTable("#files").find("tbody tr").should("have.length", 3);
    getGoaDataGrid().find("goa-table").should("have.length", 1);
    getGoaTable({ within: "goa-data-grid" }).find("tbody tr").should("have.length", 2);
  });

  it("getGoaTableRow matches a whole cell text or a RegExp", () => {
    getGoaTableRow("1002", "#files").should("have.length", 1).and("contain.text", "Jane Doe");
    getGoaTableRow("100", "#files").should("not.exist");
    getGoaTableRow(/Doe$/, "#files").should("have.length", 2);
  });

  it("getGoaTableCell reads a cell by row text and column heading", () => {
    getGoaTableCell("1002", "Status", "#files").should("have.text", "Closed");
    getGoaTableCell(/^John/, "File number", "#files").should("have.text", "1003");
    getGoaTableCell("Edmonton", "Population", { within: "goa-data-grid" }).should("have.text", "1,000,000");
  });

  it("buttons inside a row are reachable through within", () => {
    getGoaTableRow("1003", "#files").then(($row) => {
      getGoaButton({ text: "View", within: $row }).should("have.length", 1);
      clickGoaButton({ text: "View", within: $row });
    });
  });

  it("sortGoaTable cycles the direction and the table fires _sort", () => {
    sortGoaTable("Name");
    getGoaTableSortHeader("Name").should("have.attr", "direction", "asc");
    cy.get('[data-testid="events"]').should("contain.text", 'table:_sort:{"sortBy":"name","sortDir":1}');
    getGoaTable("#files").find("tbody tr td:nth-child(2)").first().should("have.text", "Ann Smith");
    sortGoaTable({ name: "name" });
    getGoaTableSortHeader("Name").should("have.attr", "direction", "desc");
    getGoaTable("#files").find("tbody tr td:nth-child(2)").first().should("have.text", "John Doe");
  });
});
