import { useEffect, useState } from "react";
import { useI18n } from "@/i18n";

const STORAGE_KEY = "cookie-consent";

export type CookieConsent = "accepted" | "rejected";

export const getCookieConsent = (): CookieConsent | null =>
  (localStorage.getItem(STORAGE_KEY) as CookieConsent | null) ?? null;

const CookieBanner = () => {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!getCookieConsent()) setVisible(true);
  }, []);

  const decide = (choice: CookieConsent) => {
    localStorage.setItem(STORAGE_KEY, choice);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label={t("cookie.region")}
      className="fixed bottom-0 left-0 right-0 z-[60] bg-background border-t border-input px-[20px] py-[16px] md:px-[40px] flex flex-col md:flex-row md:items-center gap-4 md:justify-between"
    >
      <p className="text-xs leading-relaxed opacity-70 max-w-[640px]">
        {t("cookie.text")}
      </p>
      <div className="flex gap-3 flex-shrink-0">
        <button
          onClick={() => decide("rejected")}
          className="text-xs uppercase tracking-widest border border-input px-4 py-2 hover:opacity-60 transition-opacity"
        >
          {t("cookie.reject")}
        </button>
        <button
          onClick={() => decide("accepted")}
          className="text-xs uppercase tracking-widest bg-foreground text-background px-4 py-2 hover:opacity-80 transition-opacity"
        >
          {t("cookie.accept")}
        </button>
      </div>
    </div>
  );
};

export default CookieBanner;
