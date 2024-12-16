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

Upload a file to first available file input
`uploadFileToGoaInput(fileName);`

## Contributing

Contributions are welcome! Please open an issue or submit a pull request if you'd like to improve Inspector-Goadget.
