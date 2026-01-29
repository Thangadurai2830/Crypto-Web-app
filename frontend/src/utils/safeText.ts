/**
 * XSS protection: escape user-controlled strings before display.
 * React escapes text in JSX by default; use this only when building HTML strings
 * or when interpolating into attributes. Prefer React's default rendering over
 * dangerouslySetInnerHTML with escaped content.
 */
const ENTITY_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "/": "&#x2F;",
  "`": "&#x60;",
  "=": "&#x3D;",
};

/**
 * Escape a string for safe insertion into HTML text content or attributes.
 * Use when you must build HTML manually; otherwise prefer React's default escaping.
 */
export function escapeHtml(text: string): string {
  return String(text).replace(/[&<>"'`=/]/g, (c) => ENTITY_MAP[c] ?? c);
}
