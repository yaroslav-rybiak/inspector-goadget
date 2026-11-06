# Changelog

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
