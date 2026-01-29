/**
 * Simple device fingerprint for session/security context.
 * Stored in sessionStorage so it's stable per tab/session; can be extended with canvas/hardware.
 */
const FINGERPRINT_KEY = "device_fp";

function simpleHash(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    h = (h << 5) - h + c;
    h |= 0;
  }
  return Math.abs(h).toString(36);
}

export function getDeviceFingerprint(): string {
  if (typeof window === "undefined") return "";
  try {
    let fp = sessionStorage.getItem(FINGERPRINT_KEY);
    if (fp) return fp;
    const parts = [
      navigator.userAgent,
      navigator.language,
      String(screen.width) + "x" + screen.height,
      new Date().getTimezoneOffset(),
      navigator.hardwareConcurrency ?? "",
    ];
    fp = simpleHash(parts.join("|")) + "-" + Math.random().toString(36).slice(2, 10);
    sessionStorage.setItem(FINGERPRINT_KEY, fp);
    return fp;
  } catch {
    return "";
  }
}
