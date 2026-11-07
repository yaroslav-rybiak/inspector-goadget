# inspector-goadget

Cypress helpers for the [Alberta Design System](https://design.alberta.ca) web components
(`goa-*`). Each helper pierces the shadow DOM of a component so a test can drive it in one
line instead of chaining `.shadow().find(...)` by hand.

## Compatibility

| | |
| ------------------------- | ---------------------------------------------------------------------- |
| `@abgov/web-components`   | Works with 2.x and 3.x; the suite runs against 2.5.0 and 3.2.0 in CI. |
| `cypress`                 | 13 or newer, developed and tested on 16. |

Applications built on `@abgov/angular-components` or `@abgov/react-components` render the
same `goa-*` elements inside their wrapper elements, so the helpers work there unchanged;
a `data-cy` on the wrapper is a natural `within` scope.

## Installation

```sh
npm install --save-dev inspector-goadget
```

Cypress is a peer dependency, so it has to be installed in your project already. Import
the helpers you need in a spec or in your Cypress support file:

```ts
import { clickGoaButton, fillGoaInput } from "inspector-goadget";
```

## Helpers

Helper names follow one scheme: verb + `Goa` + the component's tag name in PascalCase.
Most components have two kinds of helper:

- an **action** (`fillGoaInput`, `checkGoaCheckbox`, `selectGoaMenuButton`, ...) that drives it;
- a **locator** (`getGoaInput`, `getGoaCheckbox`, ...) that returns a Cypress chainable for
  assertions. Locators yield the element you would assert on: the native `input`,
  `textarea`, `button` or combobox inside the shadow DOM, or the host element for
  composite components.

### Finding a component

The first argument of every helper is a **locator**. A plain string means the component's
natural key: the label of the surrounding `goa-form-item` for form controls, the visible
text for buttons, chips and checkboxes, the aria label or icon name for icon buttons, the
heading for modals, drawers, tabs, accordions, callouts and the notification panel, the
message for notifications, the content for tooltips and badges. A string starting with `@` means "the
component inside the element whose test attribute has that value": `"@next"` is short for
`{ within: '[data-cy="next"]' }`. The attribute defaults to `data-cy`; change it once in
your support file with `configureGoa({ testAttribute: "data-testid" })`. For anything else
pass an object; the fields combine.

| Field      | Matches                                                                                    |
| ---------- | ------------------------------------------------------------------------------------------ |
| `label`    | Label of the surrounding `goa-form-item`, from its `label` attribute or `slot="label"` child |
| `text`     | The component's own visible text, heading or content                                        |
| `name`     | The `name` attribute                                                                        |
| `testid`   | The `testid` attribute                                                                      |
| `icon`     | The `icon` attribute (icon buttons, menu actions)                                           |
| `selector` | Any extra CSS selector appended to the tag, for example `[data-cy="next"]`                  |
| `within`   | A container: selector string, element or jQuery collection. Matches components inside it, or the container itself when it is the component, so `data-cy` can sit on a wrapper or on the host |
| `timeout`  | How long to wait for the component to appear and upgrade, in ms, instead of `defaultCommandTimeout` |

Strings match exactly after collapsing whitespace; `label` and `text` also accept a
`RegExp`. `cy.within()` scopes every helper as well.

A `within` string may use jQuery selector extensions such as `:first` or `:contains()`.
It is evaluated again on every retry, which makes it the safe choice on pages that
re-render: an element or jQuery collection captured before a re-render is detached and
matches nothing afterwards, and the failure then reads as "found 0 elements".

```ts
fillGoaInput("First name", "Ada");                                  // by form-item label
fillGoaInput({ name: "firstName" }, "Ada");                         // by name attribute
clickGoaButton("@next");                                            // the only button inside [data-cy="next"]
clickGoaButton({ within: '[data-cy="acknowledge"]:first' });        // jQuery extensions work in within
clickGoaButton({ within: "@start", timeout: 60000 });               // slow dashboard
selectGoaRadioGroup("@onBehalf", { value: "yes" });
selectGoaDropdown({ name: "worker" }, /^Jane Doe,/, { filter: "Jane" });
getGoaModal("Confirm submission").within(() => clickGoaButton("Yes, submit"));
```

Actions require exactly one match and fail otherwise with a message that names the helper,
the component and the locator, for example
`clickGoaButton: expected exactly one goa-button matching {within: "[data-cy=\"nope\"]"}, found 0`.
Locators yield every match, so `getGoaButton({ text: "View", within: $card }).should("have.length", 3)`
and `getGoaButton("Continue").first()` both work. Note that `within: ".list :first"` scopes to
the first container, not to the first matching component; use `.first()` on the locator for
that. Every locator also writes its component and locator to the Cypress command log.

Cypress cannot traverse into the shadow DOM of an empty
match, so assert absence on the host (`cy.get("goa-button").filter(...).should("not.exist")`)
rather than through a locator. And jQuery treats `open` as a boolean attribute and returns
its name instead of its value, so `have.attr("open", "true")` never passes on GoA
components; use the exported `goaOpen()` callback: `getGoaModal("Confirm").should(goaOpen())`.

### Form controls

| Component                 | Actions                                                                                      | Locator → yields                                    |
| ------------------------- | -------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| `goa-form-item`           |                                                                                              | `getGoaFormItem(label, { within?, timeout? })` → host |
| `goa-input`               | `fillGoaInput(l, text)`                                                                      | `getGoaInput(l)` → `input`                          |
| `goa-textarea`            | `fillGoaTextarea(l, text)`                                                                   | `getGoaTextarea(l)` → `textarea`                    |
| `goa-checkbox`            | `checkGoaCheckbox(l)`, `uncheckGoaCheckbox(l)`                                               | `getGoaCheckbox(l)` → `input`                       |
| `goa-checkbox-list`       | `checkGoaCheckboxList(l, texts)`, `uncheckGoaCheckboxList(l, texts)`                         | `getGoaCheckboxList(l)` → host                      |
| `goa-radio-group`         | `selectGoaRadioGroup(l, item)` where item is a label or `{ value }`                          | `getGoaRadioGroup(l)` → host, `getGoaRadioItem(l, item)` → `input` |
| `goa-dropdown`            | `selectGoaDropdown(l, option, { filter? })`, `clearGoaDropdown(l)`                           | `getGoaDropdown(l)` → combobox `input`, `getGoaDropdownOptions(l, { filter?, values? })` → `string[]` or `{ value, text }[]` |
| `goa-dropdown-multiselect`| `selectGoaDropdownMultiselect(l, texts)`, `deselectGoaDropdownMultiselect(l, texts)`         | `getGoaDropdownMultiselect(l)` → combobox, `getGoaDropdownMultiselectOptions(l, { checked? })` → `string[]` or `{ text, checked }[]` |
| `goa-date-picker`         | `selectGoaDatePicker(l, date)`                                                               | `getGoaDatePicker(l)` → display `input`             |
| `goa-calendar`            | `selectGoaCalendar(date, l?)`                                                                | `getGoaCalendar(l?)` → host                         |
| `goa-file-upload-input`   | `uploadGoaFileUploadInput(l, fileName, { waitFor?, waitForCard? })`                          | `getGoaFileUploadInput(l)` → host                   |
| `goa-file-upload-card`    | `deleteGoaFileUploadCard(l, fileName)`                                                       | `getGoaFileUploadCard(l, fileName)` → host          |

`l` is a locator. `texts` accepts one string or an array. `date` accepts a `Date` or a
`YYYY-MM-DD` string.

`getGoaDropdownOptions` reads what a dropdown offers without changing its selection: it
opens the list (typing `filter` over the current text first, for filterable dropdowns),
collects the visible options, restores the text and closes the list. That makes "is not
offered" assertable:

```ts
getGoaDropdownOptions("Province").should("include", "Alberta");
getGoaDropdownOptions({ name: "worker" }, { filter: "Jane" }).should("deep.equal", ["Jane Doe, CEC"]);
getGoaDropdownOptions({ name: "worker" }, { filter: viewer.name }).should("be.empty");
getGoaDropdownOptions("Province", { values: true }).should("deep.include", { value: "AB", text: "Alberta" });
```

`uploadGoaFileUploadInput` drops a file from the Cypress fixtures folder (jpg, jpeg, png or
pdf) and waits for the matching upload card to finish. Applications that render their own
upload UI pass `{ waitFor }` with a selector that must exist afterwards or a callback that
does the waiting; most key the wait on the file name:

```ts
uploadGoaFileUploadInput("@documents", "sin.jpg", {
  waitFor: '.file-container:contains("sin.jpg") .uploaded-icon',
});
```

`{ waitForCard: false }` returns right after the drop.

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
| `goa-temp-notification` | `clickGoaTempNotification(l?)` (the action button) | `getGoaTempNotification(l?)` → host      |

Modal, drawer and popover content is light DOM, so `getGoaModal("Confirm").within(...)`
reaches the buttons inside. Assert open state with `goaOpen()`. Temporary notifications
shown through `TemporaryNotification.show()` live inside the controller's shadow DOM; the
locator finds them there by message.

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

### Data and display

| Component                            | Actions                                                                                              | Locator → yields                                                   |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `goa-table`                          | `sortGoaTable(header)`                                                                               | `getGoaTable(l?)` → host, `getGoaTableRow(text, l?)` → `tr`, `getGoaTableCell(rowText, columnHeading, l?)` → `td` |
| `goa-table-sort-header`              |                                                                                                      | `getGoaTableSortHeader(l)` → host (`direction` attribute)          |
| `goa-data-grid`                      |                                                                                                      | `getGoaDataGrid(l?)` → host                                        |
| `goa-work-side-notification-panel`   | `selectGoaWorkSideNotificationPanel(l, tab)`, `viewAllGoaWorkSideNotificationPanel(l)`, `markAllReadGoaWorkSideNotificationPanel(l)`, `closeGoaWorkSideNotificationPanel(l)` | `getGoaWorkSideNotificationPanel(l?)` → host |
| `goa-work-side-notification-item`    | `clickGoaWorkSideNotificationItem(l)`                                                                | `getGoaWorkSideNotificationItem(l)` → host                         |
| `goa-microsite-header`               | `clickGoaMicrositeHeader(l?)` (the feedback link)                                                    | `getGoaMicrositeHeader(l?)` → host                                 |
| `goa-tooltip`                        | `showGoaTooltip(l)`, `hideGoaTooltip(l)`                                                             | `getGoaTooltip(l)` → `[role="tooltip"]`                            |
| `goa-callout`                        |                                                                                                      | `getGoaCallout(l?)` → host                                         |
| `goa-badge`                          |                                                                                                      | `getGoaBadge(l?)` → host                                           |
| `goa-linear-progress`                |                                                                                                      | `getGoaLinearProgress(l?)` → `[role="progressbar"]`                |
| `goa-circular-progress`              |                                                                                                      | `getGoaCircularProgress(l?)` → host                                |

A table's rows and cells are light DOM, so `getGoaTableRow("1002")` yields a plain `tr` and
`getGoaButton({ text: "View", within: $row })` reaches a button inside it. `getGoaTableRow`
matches a string against a whole cell and a RegExp against each cell. For the grid, scope
with `{ within: "goa-data-grid" }`.

```ts
sortGoaTable("Name");
getGoaTableSortHeader("Name").should("have.attr", "direction", "asc");
getGoaTableCell("1002", "Status").should("have.text", "Closed");
selectGoaWorkSideNotificationPanel("Notifications", "Urgent");
clickGoaWorkSideNotificationItem("Case 1001 reassigned");
showGoaTooltip("Helpful tip");
getGoaTooltip("Helpful tip").should("be.visible");
```

Components report changes through `_change`, `_click`, `_close` and similar events on the
host element. The host's `value` property is not always updated (goa-dropdown, for
instance), so assert on the locator's element or listen for the event in your application.

### Coverage

Every interactive component listed on design.alberta.ca has a helper in the tables above.
Layout and structural components (block, grid, container, card, divider, spacer, text,
icon, skeleton, spinner, the page layouts, footer and hero banner) render ordinary light
DOM and need none. The experimental public-form components are out of scope.

One quirk worth knowing with web-components 2.x: a `goa-table` that is upgraded before it
has any children renders no slot, so rows added afterwards never appear. Frameworks attach
children before inserting the element, so this only shows up in hand-written pages.

See [CHANGELOG.md](CHANGELOG.md) for what changed in each version.

## Contributing

Contributions are welcome; see [CONTRIBUTING.md](CONTRIBUTING.md) for how the library is
built and tested. Security concerns go through [SECURITY.md](SECURITY.md).

## License

Apache-2.0
