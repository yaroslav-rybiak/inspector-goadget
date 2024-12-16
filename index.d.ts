declare module "inspector-goadget" {
  export function clickGoaButton(buttonText: string): void;
  export function typeInGoaInput(label: string, text: string): void;
  export function selectGoaDropdownOption(
    dropdownLabel: string,
    optionText: string
  ): void;
  export function uploadFileToGoaInput(label: string, fileName: string): void;
}
