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
The first argument locates the component (button text, checkbox text, or the label of the
surrounding `goa-form-item`), the second is the value.

Every component has two kinds of helper:

- an **action** (`fillGoaInput`, `checkGoaCheckbox`, ...) that drives the component;
- a **locator** (`getGoaInput`, `getGoaCheckbox`, ...) that returns a Cypress chainable for
  assertions. Locators yield the element you would assert on: the native `input`,
  `textarea`, `button` or combobox inside the shadow DOM, or the host element for
  composite components.

Form-item labels match either the `label` attribute or a child with `slot="label"`,
exactly, after collapsing whitespace.

| Component                 | Actions                                                                                  | Locator                                     |
| ------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------- |
| `goa-form-item`           |                                                                                          | `getGoaFormItem(label)` → host              |
| `goa-button`              | `clickGoaButton(text)`                                                                   | `getGoaButton(text)` → `button`             |
| `goa-input`               | `fillGoaInput(label, text)`                                                              | `getGoaInput(label)` → `input`              |
| `goa-textarea`            | `fillGoaTextarea(label, text)`                                                           | `getGoaTextarea(label)` → `textarea`        |
| `goa-checkbox`            | `checkGoaCheckbox(text)`, `uncheckGoaCheckbox(text)`                                     | `getGoaCheckbox(text)` → `input`            |
| `goa-checkbox-list`       | `checkGoaCheckboxList(label, texts)`, `uncheckGoaCheckboxList(label, texts)`             | `getGoaCheckboxList(label)` → host          |
| `goa-radio-group`         | `selectGoaRadioGroup(label, itemLabel)`                                                  | `getGoaRadioGroup(label)` → host, `getGoaRadioItem(label, itemLabel)` → `input` |
| `goa-dropdown`            | `selectGoaDropdown(label, optionText)`                                                   | `getGoaDropdown(label)` → combobox `input`  |
| `goa-dropdown-multiselect`| `selectGoaDropdownMultiselect(label, texts)`, `deselectGoaDropdownMultiselect(label, texts)` | `getGoaDropdownMultiselect(label)` → combobox |
| `goa-date-picker`         | `selectGoaDatePicker(label, date)`                                                       | `getGoaDatePicker(label)` → display `input` |
| `goa-calendar`            | `selectGoaCalendar(date)`                                                                | `getGoaCalendar()` → host                   |
| `goa-file-upload-input`   | `uploadGoaFileUploadInput(label, fileName)`                                              | `getGoaFileUploadInput(label)` → host       |
| `goa-file-upload-card`    | `deleteGoaFileUploadCard(label, fileName)`                                               | `getGoaFileUploadCard(label, fileName)` → host |

`texts` arguments accept one string or an array. `date` arguments accept a `Date` or a
`YYYY-MM-DD` string. `uploadGoaFileUploadInput` takes a file from the Cypress fixtures
folder (jpg, jpeg, png or pdf) and waits for the upload card to finish.

```ts
describe("Application form", () => {
  it("submits", () => {
    cy.visit("/apply");
    fillGoaInput("First name", "Ada");
    selectGoaRadioGroup("Applying as", "Individual");
    selectGoaDropdown("Province", "Alberta");
    selectGoaDropdownMultiselect("Languages", ["English", "French"]);
    selectGoaDatePicker("Start date", "2026-11-25");
    checkGoaCheckbox("I agree to the terms");
    uploadGoaFileUploadInput("Proof of address", "bill.pdf");
    clickGoaButton("Submit and continue");

    getGoaInput("First name").should("have.value", "Ada");
    getGoaRadioItem("Applying as", "Individual").should("be.checked");
  });
});
```

Components report changes through `_change` events on the host element. The host's
`value` property is not always updated (goa-dropdown, for instance), so assert on the
locator's element or listen for `_change` in your application.

### Coverage

Covered: form-item, button, input, textarea, checkbox, checkbox-list, radio-group,
dropdown, dropdown-multiselect, date-picker, calendar, file-upload-input,
file-upload-card. Buttons, overlays, navigation and data display components are planned
for the next minor releases. Layout-only components need no helpers. The experimental
public-form components are out of scope.

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
