import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "@/locale";
import { clearLocalAnalytics } from "@/lib/analytics";
import {
  COOKIE_PREFERENCES_OPEN_EVENT,
  getCookieConsent,
  setCookieConsent,
  type CookieConsent,
} from "@/lib/cookieConsent";

const labels = {
  fr: { region: "Préférences de cookies", title: "Votre vie privée, votre choix", text: "Avec votre accord, une mesure d’audience pseudonyme enregistre la page consultée et une localisation approximative, sans conserver votre adresse IP.", reject: "Tout refuser", accept: "Tout accepter", details: "En savoir plus", close: "Fermer" },
  en: { region: "Cookie preferences", title: "Your privacy, your choice", text: "With your consent, pseudonymous audience measurement records the viewed page and an approximate location without retaining your IP address.", reject: "Reject all", accept: "Accept all", details: "Learn more", close: "Close" },
  es: { region: "Preferencias de cookies", title: "Tu privacidad, tu elección", text: "Con su consentimiento, una medición de audiencia seudónima registra la página consultada y una ubicación aproximada sin conservar su dirección IP.", reject: "Rechazar todo", accept: "Aceptar todo", details: "Más información", close: "Cerrar" },
  de: { region: "Cookie-Einstellungen", title: "Ihre Privatsphäre, Ihre Wahl", text: "Mit Ihrer Zustimmung erfasst eine pseudonyme Reichweitenmessung die besuchte Seite und einen ungefähren Standort, ohne Ihre IP-Adresse zu speichern.", reject: "Alle ablehnen", accept: "Alle akzeptieren", details: "Mehr erfahren", close: "Schließen" },
};

const CookieBanner = () => {
  const { lang, to } = useI18n();
  const copy = labels[lang];
  const panelRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [currentChoice, setCurrentChoice] = useState<CookieConsent | null>(null);

  useEffect(() => {
    const savedChoice = getCookieConsent();
    setCurrentChoice(savedChoice);
    if (!savedChoice) setVisible(true);
    const openPreferences = () => {
      setCurrentChoice(getCookieConsent());
      setVisible(true);
    };
    window.addEventListener(COOKIE_PREFERENCES_OPEN_EVENT, openPreferences);
    return () => window.removeEventListener(COOKIE_PREFERENCES_OPEN_EVENT, openPreferences);
  }, []);

  useEffect(() => {
    if (visible) panelRef.current?.focus();
  }, [visible]);

  const decide = (choice: CookieConsent) => {
    if (choice === "rejected") clearLocalAnalytics();
    setCookieConsent(choice);
    setCurrentChoice(choice);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div ref={panelRef} role="region" aria-label={copy.region} className="cookie-banner" tabIndex={-1}>
      <div className="cookie-banner-copy">
        <strong>{copy.title}</strong>
        <p>{copy.text} <Link to={to("cookies")}>{copy.details}</Link></p>
      </div>
      <div className="cookie-banner-actions">
        <button type="button" onClick={() => decide("rejected")} className="cookie-choice-button">
          {copy.reject}
        </button>
        <button type="button" onClick={() => decide("accepted")} className="cookie-choice-button">
          {copy.accept}
        </button>
        {currentChoice && <button type="button" onClick={() => setVisible(false)} className="cookie-close-button">
          {copy.close}
        </button>}
      </div>
    </div>
  );
};

export default CookieBanner;
