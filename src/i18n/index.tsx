import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { LANGUAGES, translations, type LanguageCode } from "./translations";

const STORAGE_KEY = "site-language";

const isSupported = (code: string): code is LanguageCode =>
  LANGUAGES.some((l) => l.code === code);

const detectLanguage = (): LanguageCode => {
  if (typeof window === "undefined") return "en";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && isSupported(stored)) return stored;
  const nav = navigator.language?.slice(0, 2).toLowerCase() ?? "en";
  return isSupported(nav) ? nav : "en";
};

// Module-level mirror of the active language, kept in sync by I18nProvider.
// Lets non-React modules (e.g. src/lib/data.ts) resolve localized content
// without needing every call site to be rewired to accept a language argument.
let currentLanguage: LanguageCode = detectLanguage();

export const getCurrentLanguage = (): LanguageCode => currentLanguage;

interface I18nValue {
  language: LanguageCode;
  setLanguage: (code: LanguageCode) => void;
  dir: "ltr" | "rtl";
  locale: string;
  t: (key: string, vars?: Record<string, string | number>) => string;
  tList: (key: string) => string[];
  formatPrice: (amount: number, currency?: string) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<LanguageCode>(detectLanguage);

  const meta = LANGUAGES.find((l) => l.code === language) ?? LANGUAGES[0];

  useEffect(() => {
    currentLanguage = language;
  }, [language]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = meta.dir;
    return () => {
      document.documentElement.dir = "ltr";
    };
  }, [language, meta.dir]);

  const setLanguage = useCallback((code: LanguageCode) => {
    localStorage.setItem(STORAGE_KEY, code);
    setLanguageState(code);
  }, []);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      const dict = translations[language] ?? translations.en;
      const raw = dict[key] ?? translations.en[key] ?? key;
      let value = Array.isArray(raw) ? raw.join(", ") : raw;
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          value = value.split(`{${k}}`).join(String(v));
        }
      }
      return value;
    },
    [language]
  );

  const tList = useCallback(
    (key: string) => {
      const dict = translations[language] ?? translations.en;
      const raw = dict[key] ?? translations.en[key];
      return Array.isArray(raw) ? raw : [];
    },
    [language]
  );

  const formatPrice = useCallback(
    (amount: number, currency = "EUR") =>
      new Intl.NumberFormat(meta.locale, {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      }).format(amount),
    [meta.locale]
  );

  const value = useMemo<I18nValue>(
    () => ({
      language,
      setLanguage,
      dir: meta.dir as "ltr" | "rtl",
      locale: meta.locale,
      t,
      tList,
      formatPrice,
    }),
    [language, setLanguage, meta.dir, meta.locale, t, tList, formatPrice]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within an I18nProvider");
  return ctx;
};

export { LANGUAGES };
export type { LanguageCode };
