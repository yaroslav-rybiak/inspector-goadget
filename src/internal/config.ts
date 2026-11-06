export interface GoaConfig {
  /**
   * Attribute used by the `@id` locator shorthand: `"@next"` means
   * `{ within: '[data-cy="next"]' }` with the default `data-cy`.
   */
  testAttribute: string;
}

const config: GoaConfig = { testAttribute: "data-cy" };

/**
 * Changes library-wide settings. Call it once, for example in the Cypress support file.
 *
 * @example
 * configureGoa({ testAttribute: "data-testid" });
 */
export function configureGoa(changes: Partial<GoaConfig>): void {
  Object.assign(config, changes);
}

export function goaConfig(): Readonly<GoaConfig> {
  return config;
}
