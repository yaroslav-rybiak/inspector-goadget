# Contributing

Thanks for helping. This page is for people changing the library; the README is for
people using it.

## Running the suite

The specs in `tests/` run against local fixture pages under `cypress/pages/`, which load
the pinned `@abgov/web-components` from `node_modules`. No network access is needed.

```sh
npm install
npm test            # headless Chrome, web-components 3.2.0
WC=2 npm test       # the same suite against web-components 2.5.0
npm run test:open   # interactive
npm run typecheck
```

CI runs the suite against both bundles on every push, and a change is only done when both
are green. The npm scripts go through `scripts/cypress.mjs`, which strips
`ELECTRON_RUN_AS_NODE` so Cypress also starts from a VS Code terminal.

## Conventions

- **Names**: verb + `Goa` + the component's tag name in PascalCase. The first argument is
  the locator, the second the value: `fillGoaInput(l, text)`, `selectGoaRadioGroup(l, item)`.
  Actions drive a component; `getGoa*` locators return a Cypress chainable and yield the
  element a test would assert on (the native control inside the shadow DOM, or the host
  for composite components).
- **Locators** go through `findGoaHosts` in `src/internal/locate.ts`. Give each component
  the natural key a plain string should mean (`"label"`, `"text"` or `"none"`) and, when
  the text is not the light-DOM text, a `textOf` reader. Never read a GoA `open`
  attribute through jQuery; use `isGoaOpen` / `goaOpen` from `src/internal/attributes.ts`.
- **Actions** start with `requireOneGoaHost(...)` so a miss fails with a message naming the
  helper, the tag and the locator, and click shadow controls through
  `clickShadowControl`, which checks visible and enabled and then clicks with `force`.
  Slotted text sits over the shadow control and defeats the browser hit test Cypress
  relies on; a plain click silently does nothing.
- **Both bundles**: a helper has to work on web-components 2.x and 3.x. When the markup
  differs, branch on what is in the shadow root rather than on a version number
  (`removeGoaFilterChip` is an example). Behaviour that exists only in 3.x is tested with
  `itOn3` from `tests/fixture-page.ts`.
- **No dependencies**: the published code must not import anything but Cypress globals.
  `@abgov/web-components` is a devDependency for the fixture pages only.

## Adding a component

1. Read the component's compiled source in both bundles for its shadow template, the
   events it dispatches and its `data-testid`s, then confirm at runtime with a throwaway
   spec that dumps `shadowRoot.innerHTML`. The two bundles differ in small ways.
2. Add an example to the fitting fixture page under `cypress/pages/`. Mark it with
   `data-record="<name>"` so its events land in the page's `<output>`, and have specs assert
   on that rather than on absence of errors.
3. Write `src/components/<tag>.ts` with the locator and the actions, each with a JSDoc
   comment and an example, and export it from `src/index.ts`.
4. Write `tests/<tag>.test.ts`, one `it` per behaviour, and run it on both bundles.
5. Add the component to the README tables and to the coverage table, and note anything a
   consumer needs to know (events, attributes that are not reflected).
6. One commit per component, with a message that says what the helpers do and why any
   odd decision was made.

## Pull requests

Open a pull request against `main`. Describe the application and web-components version
the change was verified against, if any. Releases are made by the maintainer.

## Reporting problems

Use the issue tracker for bugs and requests. For a security concern, see
[SECURITY.md](SECURITY.md) rather than opening a public issue.
