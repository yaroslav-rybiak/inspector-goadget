/** Local fixture pages under cypress/pages, served by Cypress from the project root. */
export type FixturePage = "buttons" | "forms" | "widgets";

/**
 * Major version of @abgov/web-components the fixture pages load: "2" when the suite
 * runs with WC=2 (the pinned 2.x package, see cypress.config.ts), otherwise "3".
 */
export function webComponentsMajor(): "2" | "3" {
  return Cypress.expose("webComponents") === "2" ? "2" : "3";
}

export function visitFixturePage(page: FixturePage): void {
  cy.visit(`cypress/pages/${page}.html?wc=${webComponentsMajor()}`);
  cy.get("html").should("have.attr", "data-web-components", webComponentsMajor());
}

/** `it` for behaviour that only exists in web-components 3.x (for example the label slot). */
export const itOn3 = webComponentsMajor() === "3" ? it : it.skip;
