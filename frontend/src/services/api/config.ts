/**
 * Shared API configuration for HTTP client and WebSocket.
 * In dev with Vite: use VITE_API_URL=/api so requests are proxied to the backend.
 * For production: set VITE_API_URL to the full backend URL (e.g. https://api.example.com).
 */
const raw = import.meta.env.VITE_API_URL ?? "/api";
export const apiBase = raw.replace(/\/v1$/, "");

/** Base URL for REST API (e.g. /api/v1 or https://api.example.com/v1) */
export const apiBaseURL = `${apiBase}/v1`;

/** WebSocket URL for a path (e.g. /ws) - same origin in dev (proxied), full URL if apiBase is absolute */
export function getWsURL(path: string): string {
  const pathNorm = path.startsWith("/") ? path : `/${path}`;
  if (apiBase.startsWith("http")) {
    const wsProtocol = apiBase.startsWith("https") ? "wss:" : "ws:";
    return `${wsProtocol}//${apiBase.replace(/^https?:/, "").replace(/\/$/, "")}${pathNorm}`;
  }
  const protocol = typeof window !== "undefined" && window.location.protocol === "https:" ? "wss:" : "ws:";
  const host = typeof window !== "undefined" ? window.location.host : "localhost:3000";
  return `${protocol}//${host}${apiBase}${pathNorm}`;
}
