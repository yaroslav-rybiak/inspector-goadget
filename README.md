# inspector-goadget

## Description

Inspector-Goadget is a Cypress-based library designed to simplify UI automation testing for Alberta Design System components. It provides efficient, reusable helper functions to interact with complex shadow DOM elements, ensuring seamless and reliable test creation.

## Installation

To add Inspector-Goadget to your Cypress project, run:
`npm install inspector-goadget --save-dev`

Import method you need:
`import { clickGoaButton } from 'inspector-goadget';`

## Supported methods:

Find a goa-button by text and click
`clickGoaButton(buttonText);`

Find a goa-input by label and type text
`typeInGoaInput(label, text);`

Find a goa-dropdown by label and select an option by text
`selectGoaDropdownOption(label, optionText);`

Find a goa-input by label and upload a file
`uploadFileToGoaInput(label, fileName);`

## Contributing

Contributions are welcome! Please open an issue or submit a pull request if you'd like to improve Inspector-Goadget.

## Examples

```
import { typeInGoaInput, uploadFileToGoaInput, clickGoaButton, selectGoaDropdownOption } from 'inspector-goadget';
describe('Check flags for bank statements and direct deposit', () => {
  it('Type', () => {
    cy.visit('https://design.alberta.ca/components/input#tab-0');
    typeInGoaInput('Basic', 'lol');
  });
  it('Upload', () => {
    cy.visit('https://design.alberta.ca/components/file-uploader#tab-0');
    uploadFileToGoaInput('Upload a file', 'SIN1.jpg');
  });
  it('Click', () => {
    cy.visit('https://design.alberta.ca/components/button#tab-0');
    clickGoaButton('Primary Button');
  });
  it('Select', () => {
    cy.visit('https://design.alberta.ca/components/dropdown#tab-0');
    selectGoaDropdownOption('Basic dropdown', 'Red');
  });
});
```
