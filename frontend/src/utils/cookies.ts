/**
 * Secure cookie handling: set cookies with Secure, SameSite, and optional path.
 * For auth tokens, prefer backend-set cookies with HttpOnly (not readable by JS).
 * This helper is for client-side cookies (e.g. preferences) when needed.
 */

const DEFAULT_OPTIONS: CookieOptions = {
  secure: typeof window !== "undefined" && window.location?.protocol === "https:",
  sameSite: "Strict",
  path: "/",
  maxAge: 365 * 24 * 60 * 60, // 1 year when using maxAge
};

export interface CookieOptions {
  /** Only send over HTTPS (default: true when page is HTTPS) */
  secure?: boolean;
  /** SameSite: Strict | Lax | None (None requires Secure) */
  sameSite?: "Strict" | "Lax" | "None";
  /** Cookie path (default: /) */
  path?: string;
  /** Max age in seconds */
  maxAge?: number;
  /** Expiry date (use maxAge or expires, not both) */
  expires?: Date;
}

/**
 * Set a cookie with secure defaults.
 * Prefer SameSite=Strict; use Lax only if you need cookies on cross-site top-level navigations.
 */
export function setCookie(
  name: string,
  value: string,
  options: Partial<CookieOptions> = {}
): void {
  if (typeof document === "undefined") return;
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const parts: string[] = [`${encodeURIComponent(name)}=${encodeURIComponent(value)}`];
  if (opts.path) parts.push(`path=${opts.path}`);
  if (opts.maxAge != null) parts.push(`max-age=${opts.maxAge}`);
  if (opts.expires) parts.push(`expires=${opts.expires.toUTCString()}`);
  if (opts.sameSite) parts.push(`samesite=${opts.sameSite}`);
  if (opts.secure) parts.push("secure");
  document.cookie = parts.join("; ");
}

/**
 * Get a cookie value by name, or null if not found.
 */
export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const prefix = `${encodeURIComponent(name)}=`;
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const trimmed = cookie.trim();
    if (trimmed.startsWith(prefix)) {
      try {
        return decodeURIComponent(trimmed.slice(prefix.length));
      } catch {
        return trimmed.slice(prefix.length);
      }
    }
  }
  return null;
}

/**
 * Remove a cookie by setting max-age=0 and past expiry.
 */
export function removeCookie(name: string, path: string = "/"): void {
  setCookie(name, "", { maxAge: 0, path });
}
