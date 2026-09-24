import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Instagram } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import FocusTrap from "focus-trap-react";
import { Portfolio } from "@/lib/data";
import { getPrimaryNav } from "@/lib/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import { useI18n } from "@/i18n";

const LeftNav = () => {
  const profile = Portfolio.profile();
  const { t } = useI18n();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const prevLocationRef = useRef(location.pathname);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navLinks = getPrimaryNav();

  // Close menu on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isMenuOpen]);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node) &&
        isMenuOpen
      ) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  // Handle route changes - temporarily disable animations
  useEffect(() => {
    if (location.pathname !== prevLocationRef.current) {
      // Route changed - temporarily remove animated class
      document.body.classList.remove("menu-animated");
      prevLocationRef.current = location.pathname;

      // Close menu if open
      if (isMenuOpen) {
        setIsMenuOpen(false);
      }
    }
  }, [location.pathname, isMenuOpen]);

  // Prevent body scroll and add menu-open class when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      setHasInteracted(true);
      document.body.style.overflow = "hidden";
      document.body.classList.add("menu-open");
      document.body.classList.add("menu-animated");
    } else if (hasInteracted) {
      document.body.style.overflow = "";
      document.body.classList.remove("menu-open");
    }
    return () => {
      document.body.style.overflow = "";
      document.body.classList.remove("menu-open");
    };
  }, [isMenuOpen, hasInteracted]);

  return (
    <>
      {/* Collapsed Trigger - Always Visible */}
      <button
        ref={triggerRef}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="fixed top-0 left-0 z-50 flex items-center gap-3 px-[40px] py-[15px] bg-background hover:opacity-80 transition-opacity duration-300"
        aria-label={isMenuOpen ? t("nav.closeMenu") : t("nav.openMenu")}
        aria-expanded={isMenuOpen}
      >
        {/* Custom Hamburger - Two Stripes */}
        <div className="flex flex-col gap-[6px] w-[20px] flex-shrink-0">
          <span
            className={`block w-[20px] h-[2px] bg-foreground transition-transform ${
              isMenuOpen ? "translate-y-[4px] rotate-45" : ""
            }`}
            style={{ transitionDuration: "400ms" }}
          />
          <span
            className={`block w-[20px] h-[2px] bg-foreground transition-transform ${
              isMenuOpen ? "-translate-y-[4px] -rotate-45" : ""
            }`}
            style={{ transitionDuration: "400ms" }}
          />
        </div>

        {/* Site Name */}
        <span
          style={{ fontSize: "19px", lineHeight: "20px" }}
          className="font-light tracking-wide"
        >
          {profile.siteName}
        </span>
      </button>

      {/* Expanded Menu - Slides Down */}
      {isMenuOpen && (
        <FocusTrap
          focusTrapOptions={{
            escapeDeactivates: false,
            allowOutsideClick: true,
            onDeactivate: () => setIsMenuOpen(false),
          }}
        >
          <div
            ref={menuRef}
            className="fixed top-0 left-0 w-[50vw] h-screen z-40 animate-slide-down overflow-y-auto bg-transparent"
            role="dialog"
            aria-modal="true"
            aria-label="Main navigation"
          >
            {/* Menu Content */}
            <div className="flex flex-col h-full px-[40px] pt-[80px] pb-[40px]">
              {/* Navigation */}
              <nav className="flex-1 space-y-3">
                {navLinks.map((link) =>
                  link.external ? (
                    <a
                      key={link.path}
                      href={link.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsMenuOpen(false)}
                      className="block font-light opacity-40 hover:opacity-70 transition-opacity duration-300"
                      style={{ fontSize: "18px" }}
                    >
                      {link.labelKey ? t(link.labelKey) : link.label}
                    </a>
                  ) : (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block font-light transition-opacity duration-300 ${
                        isActive(link.path)
                          ? "opacity-100"
                          : "opacity-40 hover:opacity-70"
                      }`}
                      style={{ fontSize: "18px" }}
                    >
                      {link.labelKey ? t(link.labelKey) : link.label}
                    </Link>
                  )
                )}
              </nav>

              {/* Footer Section */}
              <div className="space-y-6 pt-8">
                {/* Social & Theme Toggle */}
                <div className="flex items-center gap-4">
                  <a
                    href={profile.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-40 hover:opacity-100 transition-opacity duration-300"
                    aria-label={t("nav.instagram")}
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <ThemeToggle />
                  <LanguageSwitcher />
                </div>
              </div>
            </div>
          </div>
        </FocusTrap>
      )}

      {/* Custom Animation Styles */}
      <style>{`
        @keyframes slide-down {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-down {
          animation: slide-down 400ms ease-in-out forwards;
        }

        /* Default state - no transition on mount */
        main {
          transform: scale(1);
          filter: blur(0);
          opacity: 1;
        }

        /* Only apply transitions after first interaction */
        body.menu-animated.menu-open main {
          transform: scale(0.875);
          filter: blur(15px);
          opacity: 0.8;
          transition: transform 400ms ease-in-out, filter 400ms ease-in-out, opacity 400ms ease-in-out;
        }

        body.menu-animated:not(.menu-open) main {
          transform: scale(1);
          filter: blur(0);
          opacity: 1;
          transition: transform 400ms ease-in-out, filter 400ms ease-in-out, opacity 400ms ease-in-out;
        }
      `}</style>
    </>
  );
};

export default LeftNav;
