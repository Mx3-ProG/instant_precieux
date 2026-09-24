import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Instagram, Mail } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import FocusTrap from "focus-trap-react";
import { Portfolio } from "@/lib/data";
import { getPrimaryNav } from "@/lib/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import { useI18n } from "@/i18n";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const profile = Portfolio.profile();
  const navLinks = getPrimaryNav();
  const { t } = useI18n();

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isMenuOpen]);

  return (
    <>
      <a href="#main-content" className="skip-to-content">
        Skip to content
      </a>
      
      <header className="fixed top-0 left-0 right-0 z-50 py-[15px] px-[15px] md:py-[30px] md:px-[30px] flex items-center justify-between bg-background/90 backdrop-blur-sm">
        <nav className="hidden md:flex gap-x-8 text-sm uppercase tracking-widest">
          {navLinks.map((link) =>
            link.external ? (
              <a
                key={link.path}
                href={link.path}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-60 transition-opacity duration-300"
              >
                {link.labelKey ? t(link.labelKey) : link.label}
              </a>
            ) : (
              <Link
                key={link.path}
                to={link.path}
                className="hover:opacity-60 transition-opacity duration-300"
              >
                {link.labelKey ? t(link.labelKey) : link.label}
              </Link>
            )
          )}
        </nav>

        <Link
          to="/"
          className="text-2xl font-light tracking-wide absolute left-1/2 -translate-x-1/2"
        >
          {profile.siteName}
        </Link>

        <div className="hidden md:flex gap-x-4 text-sm items-center">
          <ThemeToggle />
          <LanguageSwitcher />
          <a
            href={profile.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-60 transition-opacity duration-300 p-2 -m-2 inline-flex items-center justify-center"
            aria-label={t("nav.instagram")}
          >
            <Instagram className="w-6 h-6" />
          </a>
          <a
            href={`mailto:${profile.email}`}
            className="hover:opacity-60 transition-opacity duration-300 p-2 -m-2 inline-flex items-center justify-center"
            aria-label={t("footer.emailAria")}
          >
            <Mail className="w-6 h-6" />
          </a>
        </div>

        <button
          ref={menuButtonRef}
          className="md:hidden p-2 -mr-2 z-50 inline-flex items-center justify-center"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
        >
          {isMenuOpen ? (
            <X className="w-7 h-7" />
          ) : (
            <div className="flex flex-col gap-y-1.5 w-7">
              <span className="h-0.5 w-full bg-foreground" />
              <span className="h-0.5 w-full bg-foreground" />
              <span className="h-0.5 w-full bg-foreground" />
            </div>
          )}
        </button>
      </header>

      {isMenuOpen && (
        <FocusTrap
          focusTrapOptions={{
            escapeDeactivates: false,
            allowOutsideClick: true,
            onDeactivate: () => setIsMenuOpen(false),
          }}
        >
          <div 
            id="mobile-menu"
            className="fixed inset-0 bg-background z-40 flex flex-col items-center justify-center gap-y-8"
            role="dialog"
            aria-modal="true"
            aria-label="Main navigation"
          >
            <nav>
              {navLinks.map((link) =>
                link.external ? (
                  <a
                    key={link.path}
                    href={link.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-3xl font-light tracking-tight hover:opacity-60 transition-opacity duration-300 block py-3"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.labelKey ? t(link.labelKey) : link.label}
                  </a>
                ) : (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="text-3xl font-light tracking-tight hover:opacity-60 transition-opacity duration-300 block py-3"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.labelKey ? t(link.labelKey) : link.label}
                  </Link>
                )
              )}
            </nav>
            <div className="flex gap-x-6 mt-8 items-center">
              <ThemeToggle />
              <a
                href={profile.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-60 transition-opacity duration-300 p-2 -m-2 inline-flex items-center justify-center"
                aria-label={t("nav.instagram")}
              >
                <Instagram className="w-7 h-7" />
              </a>
              <a
                href={`mailto:${profile.email}`}
                className="hover:opacity-60 transition-opacity duration-300 p-2 -m-2 inline-flex items-center justify-center"
                aria-label={t("footer.emailAria")}
              >
                <Mail className="w-7 h-7" />
              </a>
            </div>
          </div>
        </FocusTrap>
      )}
    </>
  );
};

export default Header;
