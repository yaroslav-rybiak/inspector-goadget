/** Local fixture pages under cypress/pages, served by Cypress from the project root. */
export type FixturePage = "buttons" | "forms";

export function visitFixturePage(page: FixturePage): void {
  cy.visit(`cypress/pages/${page}.html`);
}
