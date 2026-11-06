/**
 * Clicks a control inside a shadow root.
 *
 * Slotted text often sits on top of the shadow control, so the browser's hit test
 * resolves to the host element and Cypress never delivers a normal click to the
 * control. Check what matters (visible, enabled) and then click with force.
 */
export function clickShadowControl<T extends HTMLElement>(
  control: Cypress.Chainable<JQuery<T>>,
  options: { visible?: boolean } = {}
): void {
  const ready = options.visible === false ? control.should("exist") : control.should("be.visible");
  ready.and("not.be.disabled").click({ force: true });
}

/**
 * Checks or unchecks a native checkbox or radio inside a shadow root.
 *
 * GoA renders these inputs with opacity 0 behind a drawn control, so Cypress's
 * actionability check cannot pass. The component listens to the input's own
 * change or click event, which `check`/`uncheck` with force still fire.
 */
export function setShadowChecked<T extends HTMLElement>(control: Cypress.Chainable<JQuery<T>>, checked: boolean): void {
  const enabled = control.should("not.be.disabled");
  if (checked) {
    enabled.check({ force: true });
  } else {
    enabled.uncheck({ force: true });
  }
}
