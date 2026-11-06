# Changelog

## 2.5.0 - 2026-11-06

Completes coverage of the interactive components on design.alberta.ca.

### Added

- `goa-table`: `sortGoaTable`, `getGoaTable`, `getGoaTableRow`, `getGoaTableCell`,
  `getGoaTableSortHeader`; `getGoaDataGrid`.
- Notification panel: `getGoaWorkSideNotificationPanel`, `selectGoaWorkSideNotificationPanel`,
  `viewAllGoaWorkSideNotificationPanel`, `markAllReadGoaWorkSideNotificationPanel`,
  `closeGoaWorkSideNotificationPanel`, `getGoaWorkSideNotificationItem`,
  `clickGoaWorkSideNotificationItem`.
- `goa-microsite-header`: `getGoaMicrositeHeader`, `clickGoaMicrositeHeader`.
- `goa-temp-notification`: `clickGoaTempNotification` (the action button).
- `goa-tooltip`: `getGoaTooltip`, `showGoaTooltip`, `hideGoaTooltip`.
- Assertion locators `getGoaCallout`, `getGoaBadge`, `getGoaLinearProgress`,
  `getGoaCircularProgress`.

### Fixed

- `getGoaTempNotification` now finds notifications shown through
  `TemporaryNotification.show()`, which the controller renders inside its own shadow DOM
  with the message set as a property rather than an attribute.

## 2.4.0 - 2026-11-06

Shaped by the second round of feedback from the DEED e2e suite.

### Added

- **Readable failures.** Every action asserts that exactly one component matches and
  otherwise fails with `clickGoaButton: expected exactly one goa-button matching {...},
  found 0`. Every locator writes its component and locator to the Cypress command log.
  Locators are unchanged and still yield every match.
- **`@id` shorthand.** `clickGoaButton("@next")` or `within: "@next"` means the component
  inside the element whose test attribute is `next`. The attribute defaults to `data-cy`;
  `configureGoa({ testAttribute })` changes it.
- `getGoaDropdownOptions(l, { filter?, values? })` reads the options a dropdown offers,
  as texts or `{ value, text }`, without changing the selection and without firing
  `_change`. `getGoaDropdownMultiselectOptions(l, { checked? })` does the same for the
  multiselect.
- README: coverage table of all 96 `goa-*` elements, file-name keyed `waitFor` example,
  note on `:first` scoping and multi-match locators.

### Changed

- `selectGoaDropdown` with `{ filter }` types over the current text instead of using the
  clear icon, so it no longer fires an intermediate `_change` with an empty value.

## 2.3.0 - 2026-11-06

Shaped by the first production use, the DEED e2e suite (IES intake and Case Management,
both on `@abgov/web-components` 2.5.0 through the Angular wrappers).

### Added

- `timeout` on the locator: how long to wait for the component to appear and upgrade,
  instead of `defaultCommandTimeout`. `getGoaFormItem` accepts it in its options.
- `within` strings accept jQuery selector extensions (`:first`, `:contains()`) and are
  re-evaluated on every retry, so they survive page re-renders.
- `uploadGoaFileUploadInput(l, file, { waitFor })`: a selector or callback to wait on for
  applications that render their own upload UI instead of a goa-file-upload-card.
- The suite runs against `@abgov/web-components` 2.5.0 and 3.2.0 in CI. `removeGoaFilterChip`
  and `dismissGoaNotification` now handle the 2.x markup as well.

### Changed

- `engines.node` relaxed to `>=20`.

## 2.2.0 - 2026-11-06

### Added

- **Locators.** Every helper takes a locator: a string (the component's natural key) or
  an object combining `label`, `text`, `name`, `testid`, `icon`, `selector` and `within`.
  `within` takes a CSS selector, element or jQuery collection and matches the container
  itself when it is the component. `label` and `text` accept a `RegExp`.
- `selectGoaRadioGroup(group, { value })` picks a radio item by value.
- `selectGoaDropdown(l, option, { filter })` clears and types into filterable dropdowns
  before picking; options accept a `RegExp`. `clearGoaDropdown` added.
- `uploadGoaFileUploadInput` works outside a form item (`{}` or `{ within }`) and takes
  `{ waitForCard: false }`.
- `goaOpen()`, `isGoaOpen()`, `domAttr()`: read GoA's `open` attribute, which jQuery and
  Cypress's `have.attr` cannot.
- New components: goa-icon-button, goa-link-button, goa-link, goa-chip, goa-filter-chip,
  goa-pagination, goa-modal, goa-drawer, goa-push-drawer, goa-popover, goa-notification,
  goa-temp-notification, goa-menu-button, goa-menu-action, goa-tabs / goa-tab,
  goa-accordion, goa-details, goa-app-header, goa-app-header-menu, goa-side-menu /
  goa-side-menu-group, goa-work-side-menu / item / group, goa-form-stepper / goa-form-step.

### Changed

- `getGoaButton("Submit")` and other text-keyed locators now match the text exactly
  (whitespace collapsed) instead of as a substring. Use `{ text: /Submit/ }` for a
  partial match.
- `selectGoaCalendar(date, locator?)` takes an optional locator.

## 2.1.0 - 2026-11-06

### Added

- Exported locators for every component: `getGoaFormItem`, `getGoaButton`, `getGoaInput`,
  `getGoaDropdown`, `getGoaFileUploadInput`, and one for each new component below.
- `goa-textarea`: `fillGoaTextarea`, `getGoaTextarea`.
- `goa-checkbox`: `checkGoaCheckbox`, `uncheckGoaCheckbox`, `getGoaCheckbox`.
- `goa-checkbox-list`: `checkGoaCheckboxList`, `uncheckGoaCheckboxList`, `getGoaCheckboxList`.
- `goa-radio-group`: `selectGoaRadioGroup`, `getGoaRadioGroup`, `getGoaRadioItem`.
- `goa-dropdown-multiselect`: `selectGoaDropdownMultiselect`, `deselectGoaDropdownMultiselect`,
  `getGoaDropdownMultiselect`.
- `goa-date-picker`: `selectGoaDatePicker`, `getGoaDatePicker`. The picker's input is
  read-only, so dates are picked through the calendar.
- `goa-calendar`: `selectGoaCalendar`, `getGoaCalendar`.
- `goa-file-upload-card`: `deleteGoaFileUploadCard`, `getGoaFileUploadCard`.

### Changed

- Label-based helpers now match a `goa-form-item` labelled through the `label` slot as
  well as the `label` attribute (web-components 3.x supports both). Matching is exact
  after collapsing whitespace.

## 2.0.0 - 2026-11-06

Targets Alberta Design System `@abgov/web-components` 3.x. Tested against 3.2.0.

### Breaking changes

- Helpers renamed to one consistent scheme: verb + `Goa` + component tag name.
  The first argument locates the component, the second is the value.

  | 1.x                                     | 2.x                                        |
  | --------------------------------------- | ------------------------------------------ |
  | `clickGoaButton(text)`                  | `clickGoaButton(text)` (unchanged)         |
  | `typeInGoaInput(label, text)`           | `fillGoaInput(label, text)`                |
  | `selectGoaDropdownOption(label, text)`  | `selectGoaDropdown(label, text)`           |
  | `uploadFileToGoaInput(label, fileName)` | `uploadGoaFileUploadInput(label, fileName)` |

- `cypress` is now a peer dependency (`>=13`). Install it in your project.
- Node 22 or newer is required.
- `clickGoaButton` asserts the inner button is visible and enabled, then clicks with
  `force: true`. In Chrome the slotted button text covers the shadow button, so the
  browser's hit test resolves to the host and Cypress never delivered the click.

### Internal

- TypeScript 7, Cypress 16, declarations generated from source.
- Tests run against a local fixture page that loads the pinned web-components
  package, instead of design.alberta.ca.
- GitHub Actions runs typecheck, build, pack and the Cypress suite in Chrome.

## 1.1.7 and earlier

Built against `@abgov/web-components` 1.29. See the git history.
