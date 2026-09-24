import { Fragment, ReactNode, createContext, useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Check, Globe, Moon, Sun } from "lucide-react";
import type { GalleryItem, Service } from "@/content";
import { DEFAULT_LANG, LANGS, Lang, PageKey, dictionaries, localePath, parsePath } from "@/locales";
import { headTags } from "@/seo";

const LangContext = createContext<Lang>(DEFAULT_LANG);

export function LangProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  return <LangContext.Provider value={lang}>{children}</LangContext.Provider>;
}

export function useI18n() {
  const lang = useContext(LangContext);
  const t = dictionaries[lang];
  return {
    lang,
    t,
    /** Lien interne localisé : to("portfolio") → "/en/portfolio" en anglais. */
    to: (page: PageKey, query = "") => localePath(lang, page) + query,
    service: (s: Service): Service => (t.services[s.id] ? { ...s, ...t.services[s.id] } : s),
    galleryItem: (item: GalleryItem): GalleryItem => {
      const tr = t.gallery[item.id];
      const category = t.galleryCategories[item.category] ?? item.category;
      return tr ? { ...item, category, title: tr.title, description: tr.description, alt_text: tr.alt } : { ...item, category };
    },
    category: (c: { id: string; name: string; description: string }) => ({ ...c, label: t.categories[c.id]?.name ?? c.name, description: t.categories[c.id]?.description ?? c.description }),
  };
}

/** "Des souvenirs pour\nchaque *moment*" → texte avec <br/> et <em>. */
export function rich(text: string): ReactNode {
  return text.split("\n").map((line, i) => (
    <Fragment key={i}>
      {i > 0 && <br />}
      {line.split(/\*([^*]+)\*/).map((part, j) => (j % 2 ? <em key={j}>{part}</em> : part))}
    </Fragment>
  ));
}

/** Met à jour <html lang> et les balises SEO à chaque navigation côté client. */
export function HeadSync() {
  const { pathname } = useLocation();
  useEffect(() => {
    const { lang } = parsePath(pathname);
    document.documentElement.lang = dictionaries[lang].htmlLang;
    document.head.querySelectorAll("[data-seo]").forEach((node) => node.remove());
    const template = document.createElement("template");
    template.innerHTML = headTags(pathname);
    document.head.append(template.content);
  }, [pathname]);
  return null;
}

/** Sélecteur de langue : de vrais liens <a hreflang>, donc suivis par les robots. */
export function LanguageMenu({ variant = "dropdown" }: { variant?: "dropdown" | "inline" }) {
  const { lang, t } = useI18n();
  const { pathname, search } = useLocation();
  const { page } = parsePath(pathname);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);
  const links = LANGS.map((l) => (
    <Link
      key={l}
      to={localePath(l, page ?? "home") + (page ? search : "")}
      hrefLang={dictionaries[l].htmlLang}
      lang={dictionaries[l].htmlLang}
      aria-current={l === lang ? "true" : undefined}
      onClick={() => setOpen(false)}
    >
      <span className="lang-code">{l.toUpperCase()}</span>
      <span className="lang-name">{dictionaries[l].langName}</span>
      {l === lang && <Check size={14} aria-hidden />}
    </Link>
  ));
  if (variant === "inline")
    return (
      <nav className="lang-inline" aria-label={t.language}>
        {links}
      </nav>
    );
  return (
    <div className={`lang-menu ${open ? "open" : ""}`} ref={ref}>
      <button className="icon-button lang-trigger" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={t.language}>
        <Globe size={16} aria-hidden />
        <span>{lang.toUpperCase()}</span>
      </button>
      <nav className="lang-list" aria-label={t.language}>
        {links}
      </nav>
    </div>
  );
}

type Theme = "light" | "dark";
const THEME_COLORS: Record<Theme, string> = { light: "#f3ecdf", dark: "#14110f" };

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLORS[theme]);
}

/** Suit le thème système tant que le visiteur n’a pas fait de choix explicite. */
export function useSystemThemeSync() {
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      try {
        if (localStorage.getItem("ip-theme")) return;
      } catch {
        /* stockage indisponible */
      }
      applyTheme(media.matches ? "dark" : "light");
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);
}

/**
 * Bouton soleil / lune. Les deux icônes sont rendues et le CSS affiche la bonne
 * selon html[data-theme] : le HTML pré-rendu reste identique quel que soit le thème.
 * Le changement se propage depuis le bouton en cercle (View Transitions API).
 */
export function ThemeToggle() {
  const { t } = useI18n();
  function toggle(e: React.MouseEvent<HTMLButtonElement>) {
    const next: Theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    const commit = () => {
      applyTheme(next);
      try {
        localStorage.setItem("ip-theme", next);
      } catch {
        /* stockage indisponible */
      }
    };
    const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } };
    if (!doc.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return commit();
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    doc.startViewTransition(commit).ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 700, easing: "cubic-bezier(.7,0,.25,1)", pseudoElement: "::view-transition-new(root)" },
      );
    });
  }
  return (
    <button className="icon-button theme-toggle" onClick={toggle} aria-label={t.theme} title={t.theme}>
      <Sun className="sun" size={18} aria-hidden />
      <Moon className="moon" size={17} aria-hidden />
    </button>
  );
}
