/**
 * Enforce HTTPS in production: redirect HTTP -> HTTPS when not on localhost.
 * Call once at app bootstrap (e.g. in main.tsx).
 */
const LOCALHOST_HOSTNAMES = ["localhost", "127.0.0.1", "[::1]"];

export function enforceHttps(): void {
  if (typeof window === "undefined") return;
  const { protocol, hostname } = window.location;
  if (protocol !== "http:") return;
  if (LOCALHOST_HOSTNAMES.includes(hostname)) return;
  const httpsUrl = `https://${window.location.host}${window.location.pathname}${window.location.search}${window.location.hash}`;
  window.location.replace(httpsUrl);
}
