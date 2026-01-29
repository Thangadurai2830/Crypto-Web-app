/**
 * Extract a user-facing error message from an Axios/Fetch API error.
 * Handles FastAPI-style { detail: string } or { detail: [{ msg: string }] }.
 */
export function getApiErrorMessage(
  err: unknown,
  fallback = "Something went wrong"
): string {
  if (err == null || typeof err !== "object" || !("response" in err)) {
    return fallback;
  }
  const res = (err as { response?: { data?: unknown; status?: number } }).response;
  if (!res?.data || typeof res.data !== "object") return fallback;
  const data = res.data as { detail?: unknown };
  const d = data.detail;
  if (typeof d === "string") return d;
  if (Array.isArray(d) && d.length > 0) {
    const first = d[0] as { msg?: string };
    return typeof first?.msg === "string" ? first.msg : fallback;
  }
  return fallback;
}
