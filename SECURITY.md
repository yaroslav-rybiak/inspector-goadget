# Security

## Reporting a vulnerability

Please report security concerns privately through GitHub's vulnerability reporting for
this repository: https://github.com/yaroslav-rybiak/inspector-goadget/security/advisories/new.
Do not open a public issue. You should hear back within a week.

## What the package does and does not do

inspector-goadget is a development-time dependency that runs only inside Cypress test
runs, in the browser context of the application under test. The published code:

- has no runtime dependencies and calls only Cypress and DOM APIs;
- makes no network requests, reads no environment variables and touches no file system
  except through `cy.fixture()` when a test asks it to upload a fixture file;
- is published from GitHub Actions through npm trusted publishing, so every version on
  npmjs.com carries a signed provenance statement linking it to a commit and workflow run
  in this repository. No publish tokens exist.

It is not meant to be installed in production code and does nothing there.

## Supported versions

Fixes go into the latest minor version. Older versions are not patched; upgrade to the
latest release.
