import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    specPattern: "tests/**/*.test.ts",
    // No baseUrl: specs visit cypress/pages/index.html, which Cypress serves from
    // fileServerFolder (the project root). That lets the page load
    // @abgov/web-components straight out of node_modules.
    fileServerFolder: ".",
    defaultCommandTimeout: 10000,
    supportFile: "tests/support.ts",
    // Desktop layout: goa-app-header collapses its navigation into a menu button on narrow viewports.
    viewportWidth: 1280,
    viewportHeight: 800,
    video: false,
  },
});
