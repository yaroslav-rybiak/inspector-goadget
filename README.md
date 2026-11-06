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
Every component has two kinds of helper:

- an **action** (`fillGoaInput`, `checkGoaCheckbox`, `selectGoaMenuButton`, ...) that drives it;
- a **locator** (`getGoaInput`, `getGoaCheckbox`, ...) that returns a Cypress chainable for
  assertions. Locators yield the element you would assert on: the native `input`,
  `textarea`, `button` or combobox inside the shadow DOM, or the host element for
  composite components.

### Finding a component

The first argument of every helper is a **locator**. A plain string means the component's
natural key: the label of the surrounding `goa-form-item` for form controls, the visible
text for buttons, chips and checkboxes, the heading for modals, drawers, tabs and
accordions. For anything else pass an object; the fields combine.

| Field      | Matches                                                                                    |
| ---------- | ------------------------------------------------------------------------------------------ |
| `label`    | Label of the surrounding `goa-form-item`, from its `label` attribute or `slot="label"` child |
| `text`     | The component's own visible text, heading or content                                        |
| `name`     | The `name` attribute                                                                        |
| `testid`   | The `testid` attribute                                                                      |
| `icon`     | The `icon` attribute (icon buttons, menu actions)                                           |
| `selector` | Any extra CSS selector appended to the tag, for example `[data-cy="next"]`                  |
| `within`   | A container: CSS selector, element or jQuery collection. Matches components inside it, or the container itself when it is the component, so `data-cy` can sit on a wrapper or on the host |

Strings match exactly after collapsing whitespace; `label` and `text` also accept a
`RegExp`. `cy.within()` scopes every helper as well.

```ts
fillGoaInput("First name", "Ada");                                  // by form-item label
fillGoaInput({ name: "firstName" }, "Ada");                         // by name attribute
clickGoaButton({ within: '[data-cy="next"]' });                     // the only button in a wrapper
selectGoaRadioGroup({ within: '[data-cy="onBehalf"]' }, { value: "yes" });
selectGoaDropdown({ name: "worker" }, /^Jane Doe,/, { filter: "Jane" });
getGoaModal("Confirm submission").within(() => clickGoaButton("Yes, submit"));
```

Two Cypress limits to know. Cypress cannot traverse into the shadow DOM of an empty
match, so assert absence on the host (`cy.get("goa-button").filter(...).should("not.exist")`)
rather than through a locator. And jQuery treats `open` as a boolean attribute and returns
its name instead of its value, so `have.attr("open", "true")` never passes on GoA
components; use the exported `goaOpen()` callback: `getGoaModal("Confirm").should(goaOpen())`.

### Form controls

| Component                 | Actions                                                                                      | Locator → yields                                    |
| ------------------------- | -------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| `goa-form-item`           |                                                                                              | `getGoaFormItem(label, { within? })` → host         |
| `goa-input`               | `fillGoaInput(l, text)`                                                                      | `getGoaInput(l)` → `input`                          |
| `goa-textarea`            | `fillGoaTextarea(l, text)`                                                                   | `getGoaTextarea(l)` → `textarea`                    |
| `goa-checkbox`            | `checkGoaCheckbox(l)`, `uncheckGoaCheckbox(l)`                                               | `getGoaCheckbox(l)` → `input`                       |
| `goa-checkbox-list`       | `checkGoaCheckboxList(l, texts)`, `uncheckGoaCheckboxList(l, texts)`                         | `getGoaCheckboxList(l)` → host                      |
| `goa-radio-group`         | `selectGoaRadioGroup(l, item)` where item is a label or `{ value }`                          | `getGoaRadioGroup(l)` → host, `getGoaRadioItem(l, item)` → `input` |
| `goa-dropdown`            | `selectGoaDropdown(l, option, { filter? })`, `clearGoaDropdown(l)`                           | `getGoaDropdown(l)` → combobox `input`              |
| `goa-dropdown-multiselect`| `selectGoaDropdownMultiselect(l, texts)`, `deselectGoaDropdownMultiselect(l, texts)`         | `getGoaDropdownMultiselect(l)` → combobox           |
| `goa-date-picker`         | `selectGoaDatePicker(l, date)`                                                               | `getGoaDatePicker(l)` → display `input`             |
| `goa-calendar`            | `selectGoaCalendar(date, l?)`                                                                | `getGoaCalendar(l?)` → host                         |
| `goa-file-upload-input`   | `uploadGoaFileUploadInput(l, fileName, { waitForCard? })`                                    | `getGoaFileUploadInput(l)` → host                   |
| `goa-file-upload-card`    | `deleteGoaFileUploadCard(l, fileName)`                                                       | `getGoaFileUploadCard(l, fileName)` → host          |

`l` is a locator. `texts` accept one string or an array. `date` accepts a `Date` or a
`YYYY-MM-DD` string. `uploadGoaFileUploadInput` drops a file from the Cypress fixtures folder
(jpg, jpeg, png or pdf) and waits for the matching upload card to finish; pass
`{ waitForCard: false }` for applications that render no card.

### Buttons, chips, pagination

| Component          | Actions                                             | Locator → yields                        |
| ------------------ | --------------------------------------------------- | --------------------------------------- |
| `goa-button`       | `clickGoaButton(l)`                                 | `getGoaButton(l)` → `button`            |
| `goa-icon-button`  | `clickGoaIconButton(l)` (aria label or icon name)   | `getGoaIconButton(l)` → `button`        |
| `goa-link-button`  | `clickGoaLinkButton(l)`                             | `getGoaLinkButton(l)` → `button`        |
| `goa-link`         | `clickGoaLink(l)`                                   | `getGoaLink(l)` → host                  |
| `goa-chip`         | `clickGoaChip(l)`                                   | `getGoaChip(l)` → `.chip`               |
| `goa-filter-chip`  | `removeGoaFilterChip(l)`                            | `getGoaFilterChip(l)` → host            |
| `goa-pagination`   | `selectGoaPagination(page \| "next" \| "previous", l?)` | `getGoaPagination(l?)` → host     |

### Overlays and notifications

| Component               | Actions                                           | Locator → yields                          |
| ----------------------- | ------------------------------------------------- | ----------------------------------------- |
| `goa-modal`             | `closeGoaModal(l)`                                | `getGoaModal(l)` → host                   |
| `goa-drawer`            | `closeGoaDrawer(l)`                               | `getGoaDrawer(l)` → host                  |
| `goa-push-drawer`       | `closeGoaPushDrawer(l)`                           | `getGoaPushDrawer(l)` → host              |
| `goa-popover`           | `openGoaPopover(l?)`, `closeGoaPopover(l?)`       | `getGoaPopover(l?)` → host                |
| `goa-notification`      | `dismissGoaNotification(l?)`                      | `getGoaNotification(l?)` → host           |
| `goa-temp-notification` |                                                   | `getGoaTempNotification(l?)` → host       |

Modal, drawer and popover content is light DOM, so `getGoaModal("Confirm").within(...)`
reaches the buttons inside. Assert open state with `goaOpen()`.

### Menus, tabs, disclosure

| Component          | Actions                                                                  | Locator → yields                       |
| ------------------ | ------------------------------------------------------------------------ | -------------------------------------- |
| `goa-menu-button`  | `openGoaMenuButton(l)`, `selectGoaMenuButton(l, actionText)`             | `getGoaMenuButton(l)` → host           |
| `goa-menu-action`  | `clickGoaMenuAction(l)` (menu must be open)                              | `getGoaMenuAction(l)` → `button`       |
| `goa-tabs`         | `selectGoaTab(heading, tabs?)`                                           | `getGoaTabs(l?)` → host, `getGoaTab(heading)` → host |
| `goa-accordion`    | `openGoaAccordion(l)`, `closeGoaAccordion(l)`                            | `getGoaAccordion(l)` → host            |
| `goa-details`      | `openGoaDetails(l)`, `closeGoaDetails(l)`                                | `getGoaDetails(l)` → host              |

### Navigation and stepper

| Component                  | Actions                                                                         | Locator → yields                              |
| -------------------------- | ------------------------------------------------------------------------------- | --------------------------------------------- |
| `goa-app-header`           | `clickGoaAppHeader(linkText, l?)`                                               | `getGoaAppHeader(l?)` → host                  |
| `goa-app-header-menu`      | `openGoaAppHeaderMenu(l)`, `selectGoaAppHeaderMenu(l, linkText)`                | `getGoaAppHeaderMenu(l)` → host               |
| `goa-side-menu`            | `clickGoaSideMenu(linkText, l?)`                                                | `getGoaSideMenu(l?)` → host                   |
| `goa-side-menu-group`      | `openGoaSideMenuGroup(l)`, `closeGoaSideMenuGroup(l)`                           | `getGoaSideMenuGroup(l)` → host               |
| `goa-work-side-menu`       | `openGoaWorkSideMenu(l?)`, `closeGoaWorkSideMenu(l?)`                           | `getGoaWorkSideMenu(l?)` → host               |
| `goa-work-side-menu-item`  | `clickGoaWorkSideMenuItem(l)` (fires `_navigate`)                               | `getGoaWorkSideMenuItem(l)` → menu item       |
| `goa-work-side-menu-group` | `openGoaWorkSideMenuGroup(l)`, `closeGoaWorkSideMenuGroup(l)`                   | `getGoaWorkSideMenuGroup(l)` → host           |
| `goa-form-stepper`         |                                                                                 | `getGoaFormStepper(l?)` → host                |
| `goa-form-step`            | `selectGoaFormStep(l)`                                                          | `getGoaFormStep(l)` → host                    |

Components report changes through `_change`, `_click`, `_close` and similar events on the
host element. The host's `value` property is not always updated (goa-dropdown, for
instance), so assert on the locator's element or listen for the event in your application.

### Coverage

Covered: every form control, button, chip, overlay, notification, menu, tab, accordion,
details, header, side menu and the form stepper listed above (35 components). Planned for
2.3: table and sort headers, and assertion locators for callout, badge, tooltip and the
progress indicators. Layout-only components (block, grid, container, card, divider, spacer,
text, icon, skeleton, spinner, layouts, footer, hero banner) need no helpers. The
experimental public-form components are out of scope.

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
