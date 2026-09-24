export const COOKIE_CONSENT_EVENT = "cookie-consent-change";
export const COOKIE_PREFERENCES_OPEN_EVENT = "cookie-preferences-open";
export const COOKIE_CONSENT_STORAGE_KEY = "cookie-consent";

const CONSENT_VERSION = 1;
const CONSENT_DURATION_MS = 13 * 30 * 24 * 60 * 60 * 1000;

export type CookieConsent = "accepted" | "rejected";

type CookieConsentRecord = {
  version: number;
  choice: CookieConsent;
  decidedAt: string;
  expiresAt: string;
};

function isConsentChoice(value: unknown): value is CookieConsent {
  return value === "accepted" || value === "rejected";
}

export const getCookieConsent = (): CookieConsent | null => {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
  if (!raw) return null;
  try {
    const record = JSON.parse(raw) as Partial<CookieConsentRecord>;
    const valid = record.version === CONSENT_VERSION
      && isConsentChoice(record.choice)
      && typeof record.expiresAt === "string"
      && Date.parse(record.expiresAt) > Date.now();
    if (valid) return record.choice!;
  } catch {
    // Les anciennes valeurs texte sont invalidées afin de redemander un choix daté.
  }
  localStorage.removeItem(COOKIE_CONSENT_STORAGE_KEY);
  return null;
};

export function setCookieConsent(choice: CookieConsent) {
  const now = new Date();
  const record: CookieConsentRecord = {
    version: CONSENT_VERSION,
    choice,
    decidedAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + CONSENT_DURATION_MS).toISOString(),
  };
  localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(record));
  window.dispatchEvent(new CustomEvent<CookieConsent>(COOKIE_CONSENT_EVENT, { detail: choice }));
}

export function openCookiePreferences() {
  window.dispatchEvent(new Event(COOKIE_PREFERENCES_OPEN_EVENT));
}
