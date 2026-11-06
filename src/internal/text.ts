/** Collapses whitespace and trims, so labels wrapped across lines still match. */
export function normalizeText(text: string | null | undefined): string {
  return (text ?? "").replace(/\s+/g, " ").trim();
}

/** Escapes a value for use inside a double-quoted CSS attribute selector. */
export function cssAttrValue(value: string): string {
  return value.replace(/["\\]/g, "\\$&");
}
