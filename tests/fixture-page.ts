/** Local page with one example per helper. Served by Cypress from the project root. */
export const FIXTURE_PAGE = "cypress/pages/index.html";

export function visitFixturePage(): void {
  cy.visit(FIXTURE_PAGE);
}
