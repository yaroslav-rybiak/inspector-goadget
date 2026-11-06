# inspector-goadget

Cypress helpers for the [Alberta Design System](https://design.alberta.ca) web components
(`goa-*`). Each helper pierces the shadow DOM of a component so a test can drive it in one
line instead of chaining `.shadow().find(...)` by hand.

## Supported versions

| Dependency                | Supported                          |
| ------------------------- | ---------------------------------- |
| `@abgov/web-components`   | 3.x (tested against 3.2.0)         |
| `cypress`                 | 13 or newer (peer dependency)      |
| Node                      | 22 or newer                        |

For `@abgov/web-components` 1.x use `inspector-goadget@1`.

## Installation

```sh
npm install --save-dev inspector-goadget
```

Import the helpers you need in a spec or in your Cypress support file:

```ts
import { clickGoaButton, fillGoaInput } from "inspector-goadget";
```

## Helpers

Helper names follow one scheme: verb + `Goa` + the component's tag name in PascalCase.
The first argument locates the component (button text, or the label of the surrounding
`goa-form-item`), the second is the value.

| Helper                                      | Component                | What it does                                                  |
| ------------------------------------------- | ------------------------ | ------------------------------------------------------------- |
| `clickGoaButton(buttonText)`                | `goa-button`             | Clicks the button with the given visible text.                |
| `fillGoaInput(label, text)`                 | `goa-input`              | Clears the input and types the text.                          |
| `selectGoaDropdown(label, optionText)`      | `goa-dropdown`           | Opens the dropdown and clicks the option with the given text. |
| `uploadGoaFileUploadInput(label, fileName)` | `goa-file-upload-input`  | Drops a fixture file on the uploader and waits for the upload card to finish. Supports jpg, jpeg, png and pdf. |

```ts
describe("Application form", () => {
  it("submits", () => {
    cy.visit("/apply");
    fillGoaInput("First name", "Ada");
    selectGoaDropdown("Province", "Alberta");
    uploadGoaFileUploadInput("Proof of address", "bill.pdf");
    clickGoaButton("Submit and continue");
  });
});
```

Label-based helpers currently match the `label` attribute of `goa-form-item`. Labels passed
through the `label` slot are not matched yet.

## Migrating from 1.x

| 1.x                                     | 2.x                                        |
| --------------------------------------- | ------------------------------------------ |
| `typeInGoaInput(label, text)`           | `fillGoaInput(label, text)`                |
| `selectGoaDropdownOption(label, text)`  | `selectGoaDropdown(label, text)`           |
| `uploadFileToGoaInput(label, fileName)` | `uploadGoaFileUploadInput(label, fileName)` |

`clickGoaButton` keeps its name. Cypress is now a peer dependency, so make sure it is
installed in your project. See [CHANGELOG.md](CHANGELOG.md) for the full list.

## Development

The specs in `tests/` run against a local fixture page, `cypress/pages/index.html`, which
loads the pinned `@abgov/web-components` from `node_modules`. No network access is needed.

```sh
npm install
npm test        # headless, Chrome
npm run test:open
```

The npm scripts go through `scripts/cypress.mjs`, which strips `ELECTRON_RUN_AS_NODE`
so Cypress also starts from a VS Code terminal.

## Contributing

Contributions are welcome. Open an issue or a pull request at
https://github.com/yaroslav-rybiak/inspector-goadget.

## License

Apache-2.0
