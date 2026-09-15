const KEY = "bcm_cookie_consent";
const EVENT = "bcm-cookie-consent-change";

export type ConsentValue = "accepted" | "declined";

export function getCookieConsent(): ConsentValue | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === "accepted" || v === "declined" ? v : null;
  } catch {
    return null;
  }
}

/** Persists the choice and notifies anything mounted this session (Analytics), so accepting doesn't require a reload to start Google Analytics. */
export function setCookieConsent(value: ConsentValue) {
  try {
    localStorage.setItem(KEY, value);
  } catch {
    /* private browsing / storage blocked — the banner just won't remember the choice */
  }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: value }));
}

export function onCookieConsentChange(cb: (value: ConsentValue) => void): () => void {
  const handler = (e: Event) => cb((e as CustomEvent<ConsentValue>).detail);
  window.addEventListener(EVENT, handler);
  return () => window.removeEventListener(EVENT, handler);
}
