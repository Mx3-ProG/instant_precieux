import { FormEvent, lazy, ReactNode, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Link, NavLink, Navigate, Route, Routes, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  Camera,
  Check,
  ChevronRight,
  FileText,
  Home as HomeIcon,
  ImagePlus,
  LayoutDashboard,
  LogOut,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { categories, gallery as seedGallery, services as seedServices, type GalleryItem, type Service } from "@/content";
import { appointmentAction, deleteGalleryImage, deleteRow, hasSupabase, loadPublicContent, loadQuotes, saveRow, signInAdmin, supabase, updateQuoteStatus, uploadGalleryImage } from "@/lib/supabase";
import { loadPageViews, trackPageView, type PageView } from "@/lib/analytics";
import { loadLocalContent, saveLocalGallery, saveLocalServices } from "@/lib/localContent";
import SeoManager from "@/components/SeoManager";
import ImageDropzone from "@/components/ImageDropzone";
import { DEFAULT_LANG, LANGS, PAGES, type Lang, type LegalKey, type PageKey } from "@/locales";
import { HeadSync, LangProvider, LanguageMenu, ThemeToggle, rich, useI18n, useSystemThemeSync } from "@/locale";
import RisingParticles from "@/components/RisingParticles";
import WatercolorBackground from "@/components/WatercolorBackground";
import CookieBanner from "@/components/CookieBanner";
import FranceGlobe from "@/components/FranceGlobe";
import { COOKIE_CONSENT_EVENT, getCookieConsent, openCookiePreferences, type CookieConsent } from "@/lib/cookieConsent";

const AdminAnalytics = lazy(() => import("@/components/AdminAnalytics"));

type SiteContext = { services: Service[]; gallery: GalleryItem[]; refresh: () => Promise<void> };
let siteCache: SiteContext = { services: seedServices, gallery: seedGallery, refresh: async () => undefined };
const nav: PageKey[] = ["home", "portfolio", "catalogue", "about", "location", "contact"];
const cookiePreferenceLabels: Record<Lang, string> = {
  fr: "Gérer mes cookies",
  en: "Manage cookies",
  es: "Gestionar cookies",
  de: "Cookies verwalten",
};
const makeId = () => globalThis.crypto?.randomUUID?.() || `local-${Date.now()}-${Math.random().toString(36).slice(2)}`;
const euro = (lang: Lang, amount: number) => (lang === "en" ? `€${amount}` : `${amount} €`);

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return <><SeoManager /><AnalyticsTracker /></>;
}

function AnalyticsTracker() {
  const { pathname } = useLocation();
  useEffect(() => {
    let tracked = false;
    const trackAcceptedView = () => {
      if (!tracked && getCookieConsent() === "accepted") {
        tracked = true;
        trackPageView(pathname, document.title.split("|")[0].trim() || "L’instant précieux");
      }
    };
    const handleConsent = (event: Event) => {
      if ((event as CustomEvent<CookieConsent>).detail === "accepted") trackAcceptedView();
    };
    trackAcceptedView();
    window.addEventListener(COOKIE_CONSENT_EVENT, handleConsent);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, handleConsent);
  }, [pathname]);
  return null;
}

function Layout({ children }: { children: ReactNode }) {
  const { t, to } = useI18n();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);
  return (
    <div className="site-shell">
      <a className="skip-link" href="#content">
        {t.skip}
      </a>
      <header className="header">
        <Link className="wordmark" to={to("home")} onClick={() => setOpen(false)}>
          L’instant <em>précieux</em>
        </Link>
        <nav className="desktop-nav" aria-label={t.navLabel}>
          {nav.map((page) => (
            <NavLink key={page} to={to(page)} end={page === "home"}>
              {t.nav[page]}
            </NavLink>
          ))}
        </nav>
        <div className="header-actions">
          <LanguageMenu />
          <ThemeToggle />
          <Link className="header-cta" to={to("quote")}>
            {t.cta} <ArrowRight size={16} />
          </Link>
          <button className="icon-button menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? t.closeMenu : t.openMenu}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      {open && (
        <div className="mobile-menu">
          <nav>
            {nav.map((page) => (
              <NavLink key={page} to={to(page)} end={page === "home"} onClick={() => setOpen(false)}>
                {t.nav[page]}
              </NavLink>
            ))}
          </nav>
          <div className="mobile-menu-foot">
            <LanguageMenu variant="inline" />
            <Link className="button primary" to={to("quote")} onClick={() => setOpen(false)}>
              {t.cta}
            </Link>
          </div>
        </div>
      )}
      <main id="content">{children}</main>
      <Footer />
      <CookieBanner />
    </div>
  );
}

function Footer() {
  const { lang, t, to } = useI18n();
  const legal = t.legal.pages;
  return (
    <footer className="footer">
      <div>
        <p className="eyebrow">{t.footer.eyebrow}</p>
        <h2>
          L’instant <em>précieux</em>
        </h2>
        <p className="footer-copy">{t.footer.copy}</p>
      </div>
      <div>
        <p className="footer-title">{t.footer.discover}</p>
        <Link to={to("portfolio")}>{t.nav.portfolio}</Link>
        <Link to={to("catalogue")}>{t.nav.catalogue}</Link>
        <Link to={to("about")}>{t.footer.approach}</Link>
        <Link to={to("contact")}>{t.nav.contact}</Link>
      </div>
      <div>
        <p className="footer-title">{t.footer.info}</p>
        <Link to={to("mentions")}>{legal.mentions.title}</Link>
        <Link to={to("privacy")}>{legal.privacy.title}</Link>
        <Link to={to("terms")}>{legal.terms.title}</Link>
        <Link to={to("cookies")}>{legal.cookies.title}</Link>
        <button type="button" className="footer-cookie-button" onClick={openCookiePreferences}>
          {cookiePreferenceLabels[lang]}
        </button>
      </div>
      <div>
        <p className="footer-title">{t.footer.write}</p>
        <a href="mailto:bonjour@linstantprecieux.fr">bonjour@linstantprecieux.fr</a>
        <Link to="/admin" rel="nofollow">
          {t.footer.admin}
        </Link>
      </div>
      <div className="footer-bottom">
        <p>© 2026 L’instant précieux — {t.footer.rights}</p>
        <LanguageMenu variant="inline" />
      </div>
    </footer>
  );
}

function Home() {
  const { lang, t, to, service, galleryItem, category } = useI18n();
  const services = siteCache.services.map(service);
  const gallery = siteCache.gallery.map(galleryItem);
  return (
    <>
      <section className="hero video-hero">
        <video className="hero-video" autoPlay muted playsInline loop preload="metadata" poster="/hero-photographer.jpg" aria-hidden="true"><source src="/hero-photographer.mp4" type="video/mp4" /></video>
        <div className="hero-shade" />
        <div className="hero-copy hero-copy-centered reveal">
          <span className="spark">✦</span>
          <p className="eyebrow">{t.home.eyebrow}</p>
          <h1>
            L’instant
            <br />
            <em>précieux</em>
          </h1>
          <p>{t.home.lead}</p>
          <Link className="button light" to={to("quote")}>
            {t.home.book} <ArrowRight size={17} />
          </Link>
        </div>
        <span className="hero-caption">{t.home.heroCaption}</span>
      </section>
      <section className="intro section">
        <div>
          <p className="eyebrow">{t.home.servicesEyebrow}</p>
          <h2>{rich(t.home.servicesTitle)}</h2>
        </div>
        <p>{t.home.servicesText}</p>
      </section>
      <section className="category-grid section tight">
        {categories.map(category).map((c, i) => (
          <Link className="category-card category-card-particles" key={c.id} to={to("quote", `?categorie=${c.id}`)} aria-label={t.home.quoteFor.replace("{name}", c.label)}>
            <RisingParticles seed={i + 1} />
            <span className="category-number">0{i + 1}</span>
            <div className="category-content">
              <h3>{c.label}</h3>
              <p>{c.description}</p>
            </div>
            <span className="category-arrow">
              <ChevronRight />
            </span>
          </Link>
        ))}
      </section>
      <section className="featured section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{t.nav.portfolio}</p>
            <h2>{rich(t.home.portfolioTitle)}</h2>
          </div>
          <Link className="text-link" to={to("portfolio")}>
            {t.home.portfolioLink} <ArrowRight size={16} />
          </Link>
        </div>
        <div className="editorial-grid">
          {gallery.slice(0, 5).map((item, i) => (
            <figure key={item.id} className={`editorial-${i + 1}`}>
              <img src={item.image_url} alt={item.alt_text} loading="lazy" />
              <figcaption>
                <span>{item.category}</span>
                {item.title}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
      <section className="pricing section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{t.home.pricingEyebrow}</p>
            <h2>{rich(t.home.pricingTitle)}</h2>
          </div>
          <p>{t.home.pricingText}</p>
        </div>
        <div className="price-grid">
          {services.map((s, i) => (
            <PriceCard key={s.id} service={s} featured={i === 1} />
          ))}
        </div>
        <p className="usb-note">
          {t.home.usbOnly} <strong>+{euro(lang, 15)}</strong>
        </p>
      </section>
      <section className="manifesto">
        <p className="eyebrow">{t.home.manifestoEyebrow}</p>
        <h2>{rich(t.home.manifestoTitle)}</h2>
        <p>{t.home.manifestoText}</p>
        <Link className="button light" to={to("about")}>
          {t.home.manifestoCta}
        </Link>
      </section>
    </>
  );
}

function PriceCard({ service, featured = false }: { service: Service; featured?: boolean }) {
  const { lang, t, to } = useI18n();
  return (
    <article className={`price-card watercolor-price-card ${featured ? "featured-price" : ""}`}>
      <WatercolorBackground seed={service.id} />
      {featured && <span className="badge">{t.price.popular}</span>}
      <h3>{service.name}</h3>
      <p className="price">{euro(lang, service.price)}</p>
      <p>{service.description}</p>
      <ul>
        <li>
          <Check size={15} />
          {t.price.photos.replace("{n}", String(service.photoCount))}
        </li>
        <li>
          <Check size={15} />
          {t.price.atHome}
        </li>
        {service.usbIncluded && (
          <li>
            <Check size={15} />
            {t.price.usb}
          </li>
        )}
      </ul>
      <Link className="button primary" to={to("quote", `?formule=${service.id}`)}>
        {t.price.choose}
      </Link>
    </article>
  );
}

function PortfolioPage() {
  const { t, galleryItem } = useI18n();
  const gallery = siteCache.gallery.map(galleryItem);
  const [filter, setFilter] = useState<string | null>(null);
  const filters = Array.from(new Set(gallery.map((i) => i.category)));
  const items = filter ? gallery.filter((i) => i.category === filter) : gallery;
  return (
    <PageIntro eyebrow={t.nav.portfolio} title={rich(t.portfolio.title)} text={t.portfolio.text}>
      <div className="filters" role="group" aria-label={t.portfolio.filterLabel}>
        {[null, ...filters].map((f) => (
          <button className={filter === f ? "active" : ""} onClick={() => setFilter(f)} key={f ?? "all"} aria-pressed={filter === f}>
            {f ?? t.portfolio.all}
          </button>
        ))}
      </div>
      <div className="masonry">
        {items.map((item, i) => (
          <figure key={item.id} className={i % 5 === 0 ? "wide" : ""}>
            <img src={item.image_url} alt={item.alt_text} loading={i < 2 ? undefined : "lazy"} />
            <figcaption>
              <span>{item.category}</span>
              <strong>{item.title}</strong>
              <p>{item.description}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </PageIntro>
  );
}

function Catalogue() {
  const { t, service } = useI18n();
  return (
    <PageIntro eyebrow={t.catalogue.eyebrow} title={rich(t.catalogue.title)} text={t.catalogue.text}>
      <div className="price-grid catalogue-grid">
        {siteCache.services.map(service).map((s, i) => (
          <PriceCard key={s.id} service={s} featured={i === 1} />
        ))}
      </div>
      <div className="included">
        <div>
          <p className="eyebrow">{t.catalogue.includedEyebrow}</p>
          <h2>{rich(t.catalogue.includedTitle)}</h2>
        </div>
        <ul>
          {t.catalogue.included.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </PageIntro>
  );
}

function About() {
  const { t, to } = useI18n();
  return (
    <PageIntro eyebrow={t.about.eyebrow} title={rich(t.about.title)} text={t.about.text}>
      <section className="story-grid">
        {/* Boucle de 3 s (aller-retour, sans coupure visible) */}
        <video className="story-video" src="/about-photographer.mp4" poster="/about-photographer.jpg" autoPlay muted loop playsInline preload="metadata" aria-hidden="true" />
        <div>
          <p className="eyebrow">{t.about.approachEyebrow}</p>
          <h2>{rich(t.about.approachTitle)}</h2>
          <p>{t.about.p1}</p>
          <p>{t.about.p2}</p>
          <Link className="text-link" to={to("quote")}>
            {t.about.link} <ArrowRight size={16} />
          </Link>
        </div>
      </section>
      <blockquote>{t.about.quote}</blockquote>
    </PageIntro>
  );
}

function LocationPage() {
  const { t, to } = useI18n();
  // Une URL ici est une erreur de configuration : on ne l’affiche pas aux visiteurs.
  const configured = String(import.meta.env.VITE_STUDIO_ADDRESS || "").trim();
  const address = configured && !/^https?:\/\//i.test(configured) ? configured : t.location.addressFallback;
  return (
    <PageIntro eyebrow={t.location.eyebrow} title={rich(t.location.title)} text={t.location.text}>
      <div className="location-grid">
        <FranceGlobe label={t.location.mapLabel} caption={address} />
        <div className="location-copy">
          <p className="eyebrow">{t.location.travelEyebrow}</p>
          <h2>{rich(t.location.travelTitle)}</h2>
          <p>{t.location.travelText}</p>
          <Link className="button primary" to={to("quote")}>
            {t.location.cta}
          </Link>
        </div>
      </div>
    </PageIntro>
  );
}

function ContactPage() {
  const { t, to } = useI18n();
  return (
    <PageIntro eyebrow={t.contact.eyebrow} title={rich(t.contact.title)} text={t.contact.text}>
      <div className="contact-grid">
        <div>
          <Mail size={25} />
          <h3>{t.contact.byEmail}</h3>
          <a href="mailto:bonjour@linstantprecieux.fr">bonjour@linstantprecieux.fr</a>
          <p>{t.contact.reply}</p>
        </div>
        <div>
          <MapPin size={25} />
          <h3>{t.contact.area}</h3>
          <p>{t.contact.areaText}</p>
        </div>
        <Link className="contact-action" to={to("quote")}>
          <span>{t.contact.ready}</span>
          <strong>{t.cta}</strong>
          <ArrowRight />
        </Link>
      </div>
    </PageIntro>
  );
}

function QuotePage() {
  const { lang, t, to, service, category } = useI18n();
  const [params] = useSearchParams();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  // ?categorie= accepte l’identifiant (liens actuels) ou l’ancien libellé français.
  const requested = params.get("categorie");
  const initialCategory = categories.find((c) => c.id === requested || c.name === requested) ?? categories.find((c) => c.id === "famille")!;
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    // Libellé traduit de la catégorie, repris dans l’email envoyé au client.
    const categorySelect = e.currentTarget.elements.namedItem("category") as HTMLSelectElement | null;
    payload.category_label = categorySelect?.selectedOptions[0]?.text ?? "";
    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error("api");
      setSent(true);
    } catch {
      const saved = JSON.parse(localStorage.getItem("instant-precieux-quotes") || "[]");
      saved.unshift({ id: makeId(), ...payload, status: "nouvelle", created_at: new Date().toISOString() });
      localStorage.setItem("instant-precieux-quotes", JSON.stringify(saved));
      setSent(true);
    } finally {
      setLoading(false);
    }
  }
  if (sent)
    return (
      <div className="success-screen">
        <span>
          <Check />
        </span>
        <p className="eyebrow">{t.quote.sentEyebrow}</p>
        <h1>{rich(t.quote.sentTitle)}</h1>
        <p>{t.quote.sentText}</p>
        <Link className="button primary" to={to("home")}>
          {t.quote.backHome}
        </Link>
      </div>
    );
  return (
    <PageIntro eyebrow={t.quote.eyebrow} title={rich(t.quote.title)} text={t.quote.text}>
      <form className="quote-form" onSubmit={submit}>
        <input type="hidden" name="lang" value={lang} />
        <div className="form-section">
          <span>01</span>
          <div>
            <h2>{t.quote.contactStep}</h2>
            <div className="field-grid">
              <label>
                {t.quote.name}
                <input name="name" required autoComplete="name" />
              </label>
              <label>
                {t.quote.email}
                <input name="email" type="email" required autoComplete="email" />
              </label>
              <label>
                {t.quote.phone}
                <input name="phone" type="tel" autoComplete="tel" />
              </label>
              <label>
                {t.quote.city}
                <input name="city" required autoComplete="address-level2" />
              </label>
            </div>
          </div>
        </div>
        <div className="form-section">
          <span>02</span>
          <div>
            <h2>{t.quote.sessionStep}</h2>
            <div className="field-grid">
              <label>
                {t.quote.category}
                {/* La valeur reste le libellé français : c’est ce que reçoit l’administration. */}
                <select name="category" defaultValue={initialCategory.name}>
                  {categories.map(category).map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                {t.quote.formula}
                <select name="service_id" defaultValue={params.get("formule") || "souvenir"}>
                  {siteCache.services.map(service).map((s) => (
                    <option value={s.id} key={s.id}>
                      {s.name} — {euro(lang, s.price)}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                {t.quote.date}
                <input name="preferred_date" type="date" />
              </label>
              <label>
                {t.quote.people}
                <input name="people_count" type="number" min="1" defaultValue="2" />
              </label>
            </div>
          </div>
        </div>
        <div className="form-section">
          <span>03</span>
          <div>
            <h2>{t.quote.storyStep}</h2>
            <label>
              {t.quote.message}
              <textarea name="message" rows={6} placeholder={t.quote.placeholder} required />
            </label>
            <label className="consent">
              <input type="checkbox" required /> {t.quote.consent}
            </label>
            <input className="honeypot" name="company" tabIndex={-1} autoComplete="off" />
            <button className="button primary" disabled={loading}>
              {loading ? t.quote.sending : t.quote.send}
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </form>
    </PageIntro>
  );
}

function PageIntro({ eyebrow, title, text, children }: { eyebrow: string; title: ReactNode; text: string; children: ReactNode }) {
  return (
    <div className="page">
      <section className="page-hero">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{text}</p>
      </section>
      {children}
    </div>
  );
}

function LegalPage({ kind }: { kind: LegalKey }) {
  const { t } = useI18n();
  const c = t.legal.pages[kind];
  return (
    <PageIntro eyebrow={t.legal.eyebrow} title={<em>{c.title}</em>} text={c.intro}>
      <div className="legal">
        <p className="legal-note">{t.legal.draft}</p>
        {c.sections.map(([title, body]) => (
          <section key={title}>
            <h2>{title}</h2>
            <p>{body}</p>
          </section>
        ))}
      </div>
    </PageIntro>
  );
}

type Quote = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  category: string;
  service_id: string;
  status: string;
  created_at: string;
  message?: string;
  preferred_date?: string | null;
  appointment_at?: string | null;
  appointment_duration?: number | null;
  appointment_location?: string | null;
  appointment_note?: string | null;
  appointment_status?: "proposee" | "confirmee" | "a_replanifier" | null;
  client_response?: string | null;
};
function AdminLogin() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    try {
      await signInAdmin(String(form.get("email")), String(form.get("password")));
      sessionStorage.setItem("instant-admin", "true");
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connexion impossible");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="admin-login">
      <Link className="wordmark" to="/">
        L’instant <em>précieux</em>
      </Link>
      <form onSubmit={submit}>
        <p className="eyebrow">Espace administrateur</p>
        <h1>Bienvenue</h1>
        <p>Gérez le portfolio, les prestations et les demandes depuis un seul espace.</p>
        {!hasSupabase && <div className="demo-note">Mode démonstration actif. Utilisez n’importe quel email et mot de passe.</div>}
        <label>
          Email
          <input type="email" name="email" defaultValue={!hasSupabase ? "demo@linstantprecieux.fr" : ""} required />
        </label>
        <label>
          Mot de passe
          <input type="password" name="password" defaultValue={!hasSupabase ? "demonstration" : ""} required />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button className="button primary" disabled={loading}>
          {loading ? "Connexion…" : "Se connecter"}
        </button>
        <Link to="/">Retour au site</Link>
      </form>
    </div>
  );
}

function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("overview");
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [views, setViews] = useState<PageView[]>([]);
  const [gallery, setGallery] = useState(siteCache.gallery);
  const [services, setServices] = useState(siteCache.services);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [newService, setNewService] = useState(false);
  const [newPhoto, setNewPhoto] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoError, setPhotoError] = useState("");
  const [photoUploading, setPhotoUploading] = useState(false);
  const [planning, setPlanning] = useState<Quote | null>(null);
  const [params] = useSearchParams();
  // Lien « Proposer une date » des emails admin : /admin/dashboard?demande=<id>
  const requestedQuote = params.get("demande");
  useEffect(() => {
    if (!requestedQuote) return;
    const match = quotes.find((q) => q.id === requestedQuote);
    if (!match) return;
    setTab("quotes");
    setPlanning(match);
  }, [requestedQuote, quotes]);
  useEffect(() => {
    if (sessionStorage.getItem("instant-admin") !== "true") {
      navigate("/admin");
      return;
    }
    let cancelled = false;
    const hydrateDashboard = async () => {
      if (supabase) {
        const { data, error } = await supabase.auth.getSession();
        const isAdmin = data.session?.user.app_metadata?.role === "admin";
        if (error || !isAdmin) {
          sessionStorage.removeItem("instant-admin");
          navigate("/admin");
          return;
        }
      }
      const local = JSON.parse(localStorage.getItem("instant-precieux-quotes") || "[]");
      const [remoteQuotes, pageViews] = await Promise.all([
        loadQuotes().catch(() => local),
        loadPageViews().catch(() => []),
      ]);
      if (cancelled) return;
      setQuotes((remoteQuotes.length ? remoteQuotes : local) as Quote[]);
      setViews(pageViews);
    };
    void hydrateDashboard();
    return () => { cancelled = true; };
  }, [navigate]);
  async function logout() {
    await supabase?.auth.signOut();
    sessionStorage.removeItem("instant-admin");
    navigate("/admin");
  }
  async function setStatus(id: string, status: string) {
    setQuotes((q) => q.map((x) => (x.id === id ? { ...x, status } : x)));
    await updateQuoteStatus(id, status).catch(() => undefined);
  }
  function patchQuote(id: string, patch: Partial<Quote>) {
    setQuotes((q) => q.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  }
  function commitServices(update: (items: Service[]) => Service[]) {
    setServices((items) => {
      const next = update(items);
      saveLocalServices(next);
      siteCache.services = next;
      return next;
    });
  }
  function commitGallery(update: (items: GalleryItem[]) => GalleryItem[]) {
    setGallery((items) => {
      const next = update(items);
      saveLocalGallery(next);
      siteCache.gallery = next;
      return next;
    });
  }
  async function removeGallery(item: GalleryItem) {
    if (!window.confirm(`Supprimer définitivement « ${item.title} » du portfolio ?`)) return;
    try {
      await deleteRow("gallery_items", item.id);
      commitGallery((items) => items.filter((current) => current.id !== item.id));
      await deleteGalleryImage(item.image_url).catch(() => undefined);
    } catch {
      window.alert("La photo n’a pas pu être supprimée. Réessayez dans un instant.");
    }
  }
  async function removeService(service: Service) {
    if (!window.confirm(`Supprimer définitivement la prestation « ${service.name} » ?`)) return;
    try {
      await deleteRow("services", service.id);
      commitServices((items) => items.filter((item) => item.id !== service.id));
    } catch {
      window.alert("La prestation n’a pas pu être supprimée. Réessayez dans un instant.");
    }
  }
  async function saveServiceForm(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editingService) return;
    const f = new FormData(e.currentTarget);
    const row = {
      ...editingService,
      name: String(f.get("name")),
      price: Number(f.get("price")),
      photoCount: Number(f.get("photoCount")),
      description: String(f.get("description")),
      usbIncluded: f.get("usbIncluded") === "on",
    };
    try {
      await saveRow("services", {
        id: row.id,
        name: row.name,
        price: row.price,
        photo_count: row.photoCount,
        description: row.description,
        usb_included: row.usbIncluded,
        published: true,
      });
      commitServices((items) => items.map((item) => (item.id === row.id ? row : item)));
      setEditingService(null);
    } catch {
      window.alert("Les modifications n’ont pas pu être enregistrées.");
    }
  }
  async function addService(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name"));
    const slug = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const service: Service = {
      id: `${slug || "prestation"}-${Date.now().toString(36)}`,
      name,
      price: Number(form.get("price")),
      photoCount: Number(form.get("photoCount")),
      description: String(form.get("description")),
      usbIncluded: form.get("usbIncluded") === "on",
      published: true,
    };
    try {
      await saveRow("services", { id: service.id, name: service.name, price: service.price, photo_count: service.photoCount, description: service.description, usb_included: service.usbIncluded, published: true, sort_order: services.length + 1 });
      commitServices((items) => [...items, service]);
      setNewService(false);
    } catch {
      window.alert("La prestation n’a pas pu être ajoutée.");
    }
  }
  function choosePhoto(file: File | null) {
    setPhotoError("");
    if (!file) { setPhotoFile(null); return; }
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) { setPhotoError("Format non pris en charge. Choisissez un JPG, PNG ou WebP."); return; }
    if (file.size > 10 * 1024 * 1024) { setPhotoError("Cette image dépasse 10 Mo."); return; }
    setPhotoFile(file);
  }
  async function addPhoto(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!photoFile) { setPhotoError("Ajoutez une photo avant de publier."); return; }
    setPhotoUploading(true);
    setPhotoError("");
    let imageUrl = "";
    try {
      const form = new FormData(e.currentTarget);
      imageUrl = await uploadGalleryImage(photoFile);
      const item: GalleryItem = { id: makeId(), title: String(form.get("title")), category: String(form.get("category")), description: String(form.get("description")), image_url: imageUrl, alt_text: String(form.get("alt_text")), published: true };
      await saveRow("gallery_items", { ...item, sort_order: 0 });
      commitGallery((items) => [item, ...items]);
      setNewPhoto(false);
      setPhotoFile(null);
    } catch (error) {
      if (imageUrl) await deleteGalleryImage(imageUrl).catch(() => undefined);
      setPhotoError(error instanceof Error ? error.message : "L’image n’a pas pu être publiée.");
    } finally {
      setPhotoUploading(false);
    }
  }
  const pending = quotes.filter((q) => q.status === "nouvelle").length;
  const uniqueVisitors = new Set(views.map((view) => view.visitor_id)).size;
  return (
    <div className="dashboard">
      <aside>
        <Link className="wordmark" to="/">
          L’instant <em>précieux</em>
        </Link>
        <nav>
          <button className={tab === "overview" ? "active" : ""} onClick={() => setTab("overview")}>
            <LayoutDashboard />
            <b>Vue d’ensemble</b>
          </button>
          <button className={tab === "gallery" ? "active" : ""} onClick={() => setTab("gallery")}>
            <ImagePlus />
            <b>Portfolio</b>
          </button>
          <a className="admin-home-link" href="/" aria-label="Retourner sur le site">
            <HomeIcon />
            <b>Accueil</b>
          </a>
          <button className={tab === "services" ? "active" : ""} onClick={() => setTab("services")}>
            <Pencil />
            <b>Prestations</b>
          </button>
          <button className={tab === "quotes" ? "active" : ""} onClick={() => setTab("quotes")}>
            <Mail />
            <b>Demandes</b> {pending > 0 && <span>{pending}</span>}
          </button>
        </nav>
        <button className="logout" onClick={logout}>
          <LogOut />
          Déconnexion
        </button>
      </aside>
      <section className="dashboard-main">
        <header>
          <div>
            <p className="eyebrow">Administration</p>
            <h1>
              {tab === "overview"
                ? "Vue d’ensemble"
                : tab === "gallery"
                  ? "Portfolio"
                  : tab === "services"
                    ? "Prestations"
                    : "Demandes de devis"}
            </h1>
          </div>
          <a className="button outline" href="/" target="_blank">
            Voir le site
          </a>
        </header>
        {tab === "overview" && (
          <>
            <div className="stats">
              <article>
                <span>Demandes à traiter</span>
                <strong>{pending}</strong>
              </article>
              <article>
                <span>Visiteurs</span>
                <strong>{uniqueVisitors}</strong>
              </article>
              <article>
                <span>Pages vues</span>
                <strong>{views.length}</strong>
              </article>
              <article>
                <span>Photos publiées</span>
                <strong>{gallery.length}</strong>
              </article>
            </div>
            <Suspense fallback={<section className="dashboard-panel analytics-loading">Chargement du graphique…</section>}>
              <AdminAnalytics views={views} />
            </Suspense>
            <section className="dashboard-panel">
              <h2>Dernières demandes</h2>
              <QuoteTable quotes={quotes.slice(0, 5)} onStatus={setStatus} onPlan={setPlanning} />
            </section>
          </>
        )}
        {tab === "gallery" && (
          <section className="dashboard-panel">
            <div className="panel-head">
              <div>
                <h2>Images publiées</h2>
                <p>Glissez une photo, décrivez-la et publiez-la directement dans le portfolio.</p>
              </div>
              <button className="button primary" onClick={() => setNewPhoto(true)}>
                <Plus />
                Ajouter une photo
              </button>
            </div>
            <div className="admin-gallery">
              {gallery.map((item) => (
                <article key={item.id}>
                  <img src={item.image_url} alt="" />
                  <div>
                    <strong>{item.title}</strong>
                    <span>{item.category}</span>
                  </div>
                  <button onClick={() => removeGallery(item)} aria-label={`Supprimer ${item.title}`}>
                    <Trash2 />
                  </button>
                </article>
              ))}
            </div>
          </section>
        )}
        {tab === "services" && (
          <section className="dashboard-panel">
            <div className="panel-head">
              <div>
                <h2>Catalogue</h2>
                <p>Ajoutez, modifiez ou retirez les prestations visibles par vos clients.</p>
              </div>
              <button className="button primary" onClick={() => setNewService(true)}>
                <Plus />
                Ajouter une prestation
              </button>
            </div>
            <div className="service-list">
              {services.map((s) => (
                <article key={s.id}>
                  <div>
                    <strong>{s.name}</strong>
                    <span>
                      {s.photoCount} photos · {s.price} €
                    </span>
                  </div>
                  <div className="service-actions">
                    <button onClick={() => setEditingService(s)}><Pencil />Modifier</button>
                    <button className="danger-action" onClick={() => removeService(s)}><Trash2 />Supprimer</button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
        {tab === "quotes" && (
          <section className="dashboard-panel">
            <div className="panel-head">
              <div>
                <h2>Toutes les demandes</h2>
                <p>Proposez une date de rendez-vous : le client la confirme en un clic depuis son email.</p>
              </div>
              <label className="search">
                <Search />
                <input placeholder="Rechercher" />
              </label>
            </div>
            <QuoteTable quotes={quotes} onStatus={setStatus} onPlan={setPlanning} />
          </section>
        )}
      </section>
      {editingService && (
        <div className="modal-backdrop">
          <form className="modal" onSubmit={saveServiceForm}>
            <button type="button" className="modal-close" onClick={() => setEditingService(null)}>
              <X />
            </button>
            <p className="eyebrow">Modifier la prestation</p>
            <h2>{editingService.name}</h2>
            <label>
              Nom
              <input name="name" defaultValue={editingService.name} />
            </label>
            <label>
              Prix
              <input name="price" type="number" defaultValue={editingService.price} />
            </label>
            <label>
              Nombre de photos
              <input name="photoCount" type="number" defaultValue={editingService.photoCount} />
            </label>
            <label>
              Description
              <textarea name="description" defaultValue={editingService.description} />
            </label>
            <label className="consent">
              <input name="usbIncluded" type="checkbox" defaultChecked={editingService.usbIncluded} /> Clé USB incluse
            </label>
            <button className="button primary">Enregistrer</button>
          </form>
        </div>
      )}
      {newService && (
        <div className="modal-backdrop">
          <form className="modal" onSubmit={addService}>
            <button type="button" className="modal-close" onClick={() => setNewService(false)}><X /></button>
            <p className="eyebrow">Nouvelle prestation</p>
            <h2>Ajouter au catalogue</h2>
            <div className="modal-fields">
              <label>Nom<input name="name" required placeholder="Collection naissance" /></label>
              <label>Prix en euros<input name="price" type="number" min="0" step="1" required placeholder="120" /></label>
              <label>Nombre de photos<input name="photoCount" type="number" min="0" required placeholder="20" /></label>
              <label>Description<textarea name="description" required placeholder="Décrivez simplement ce qui est inclus…" /></label>
              <label className="consent"><input name="usbIncluded" type="checkbox" /> Clé USB incluse</label>
            </div>
            <button className="button primary"><Plus />Ajouter la prestation</button>
          </form>
        </div>
      )}
      {newPhoto && (
        <div className="modal-backdrop">
          <form className="modal photo-modal" onSubmit={addPhoto}>
            <button type="button" className="modal-close" onClick={() => { setNewPhoto(false); setPhotoFile(null); setPhotoError(""); }}>
              <X />
            </button>
            <p className="eyebrow">Nouvelle image</p>
            <h2>Ajouter au portfolio</h2>
            <ImageDropzone file={photoFile} onFile={choosePhoto} error={photoError} />
            <div className="modal-fields two-columns">
              <label>Titre<input name="title" required placeholder="Un instant suspendu" /></label>
              <label>Catégorie<input name="category" list="photo-categories" required placeholder="Famille" /><datalist id="photo-categories">{categories.map((category) => <option key={category.id} value={category.name} />)}</datalist></label>
              <label>Texte alternatif<input name="alt_text" required placeholder="Décrivez précisément ce que montre la photo" /></label>
              <label>Description<textarea name="description" placeholder="Quelques mots pour raconter cette image…" /></label>
            </div>
            <button className="button primary" disabled={photoUploading}>{photoUploading ? "Publication en cours…" : "Publier la photo"}<ArrowRight size={17} /></button>
          </form>
        </div>
      )}
      {planning && (
        <AppointmentModal
          quote={planning}
          onClose={() => setPlanning(null)}
          onSaved={(patch) => {
            patchQuote(planning.id, patch);
            setPlanning(null);
          }}
        />
      )}
    </div>
  );
}

const APPOINTMENT_LABELS = { proposee: "Date proposée", confirmee: "Confirmé", a_replanifier: "Autre date demandée" } as const;
const formatAppointment = (iso: string) =>
  new Date(iso).toLocaleString("fr-FR", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" });
/** Valeur par défaut du champ datetime-local : date souhaitée par le client à 10 h, sinon dans une semaine. */
function defaultSlot(q: Quote) {
  const base = q.appointment_at ? new Date(q.appointment_at) : q.preferred_date ? new Date(`${q.preferred_date}T10:00`) : new Date(Date.now() + 7 * 86400000);
  if (!q.appointment_at && !q.preferred_date) base.setHours(10, 0, 0, 0);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${base.getFullYear()}-${pad(base.getMonth() + 1)}-${pad(base.getDate())}T${pad(base.getHours())}:${pad(base.getMinutes())}`;
}

function AppointmentModal({ quote, onClose, onSaved }: { quote: Quote; onClose: () => void; onSaved: (patch: Partial<Quote>) => void }) {
  const [mode, setMode] = useState<"propose" | "refuse">("propose");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    try {
      if (mode === "refuse") {
        await appointmentAction({ action: "refuse", id: quote.id, message: form.get("message") });
        onSaved({ status: "refusee", appointment_status: null });
      } else {
        const result = await appointmentAction({
          action: "propose",
          id: quote.id,
          appointment_at: new Date(String(form.get("appointment_at"))).toISOString(),
          duration: Number(form.get("duration")),
          location: form.get("location"),
          note: form.get("note"),
        });
        onSaved({ status: "acceptee", appointment_status: "proposee", client_response: null, ...(result as Partial<Quote>) });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Envoi impossible");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="modal-backdrop">
      <form className="modal" onSubmit={submit}>
        <button type="button" className="modal-close" onClick={onClose} aria-label="Fermer"><X /></button>
        <p className="eyebrow">{mode === "propose" ? "Proposer un rendez-vous" : "Décliner la demande"}</p>
        <h2>{quote.name}</h2>
        <p className="appointment-context">
          {quote.category}
          {quote.preferred_date ? ` · souhaitée le ${new Date(`${quote.preferred_date}T12:00`).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}` : " · date flexible"}
        </p>
        {quote.appointment_status === "a_replanifier" && quote.client_response && (
          <blockquote className="appointment-response">« {quote.client_response} »</blockquote>
        )}
        {mode === "propose" ? (
          <div className="modal-fields">
            <label>Date et heure<input name="appointment_at" type="datetime-local" required defaultValue={defaultSlot(quote)} /></label>
            <label>
              Durée
              <select name="duration" defaultValue={String(quote.appointment_duration || 90)}>
                {[45, 60, 90, 120, 180].map((m) => <option key={m} value={m}>{m < 60 ? `${m} min` : `${Math.floor(m / 60)} h${m % 60 ? ` ${m % 60}` : ""}`}</option>)}
              </select>
            </label>
            <label>Lieu<input name="location" required defaultValue={quote.appointment_location || quote.city || ""} placeholder="Adresse ou commune" /></label>
            <label>Un mot pour le client<textarea name="note" defaultValue={quote.appointment_note || ""} placeholder="Quelques conseils, une précision sur le déroulé…" /></label>
          </div>
        ) : (
          <label>Message personnel (facultatif)<textarea name="message" placeholder="Ex. : je suis complète jusqu’en décembre, mais je serais ravie de vous photographier au printemps." /></label>
        )}
        {error && <p className="form-error">{error}</p>}
        <button className="button primary" disabled={loading}>
          {loading ? "Envoi…" : mode === "propose" ? "Envoyer la proposition" : "Envoyer la réponse"}
          <ArrowRight size={17} />
        </button>
        <button type="button" className="text-link appointment-switch" onClick={() => setMode(mode === "propose" ? "refuse" : "propose")}>
          {mode === "propose" ? "Décliner cette demande" : "Revenir à la proposition de date"}
        </button>
      </form>
    </div>
  );
}

function QuoteTable({ quotes, onStatus, onPlan }: { quotes: Quote[]; onStatus: (id: string, status: string) => void; onPlan: (quote: Quote) => void }) {
  if (!quotes.length)
    return (
      <div className="empty-state">
        <Mail />
        <strong>Aucune demande pour le moment</strong>
        <p>Les nouveaux devis apparaîtront ici.</p>
      </div>
    );
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Client</th>
            <th>Projet</th>
            <th>Formule</th>
            <th>Date</th>
            <th>Rendez-vous</th>
            <th>Statut</th>
            <th>Relancer</th>
          </tr>
        </thead>
        <tbody>
          {quotes.map((q) => {
            const subject = encodeURIComponent("Suite à votre demande de devis — L’instant précieux");
            const message = encodeURIComponent(`Bonjour ${q.name},\n\nJe reviens vers vous concernant votre demande pour une séance ${q.category}. N’hésitez pas à me communiquer vos disponibilités afin que nous puissions avancer ensemble.\n\nÀ bientôt,\nL’instant précieux`);
            return <tr key={q.id}>
              <td>
                <strong>{q.name}</strong>
                <span>{q.email}</span>
                {q.phone ? <span>{q.phone}</span> : null}
              </td>
              <td>{q.category}</td>
              <td>{q.service_id}</td>
              <td>{new Date(q.created_at).toLocaleDateString("fr-FR")}</td>
              <td>
                {q.appointment_at && q.appointment_status ? (
                  <>
                    <strong>{formatAppointment(q.appointment_at)}</strong>
                    <span className={`appointment-badge ${q.appointment_status}`}>{APPOINTMENT_LABELS[q.appointment_status]}</span>
                  </>
                ) : null}
                {q.status !== "refusee" && q.status !== "archivee" && q.appointment_status !== "confirmee" && (
                  <button type="button" className="appointment-plan" onClick={() => onPlan(q)}>
                    {q.appointment_status ? "Nouvelle date" : "Proposer une date"}
                  </button>
                )}
              </td>
              <td>
                <select value={q.status} onChange={(e) => onStatus(q.id, e.target.value)}>
                  <option value="nouvelle">Nouvelle</option>
                  <option value="acceptee">Acceptée</option>
                  <option value="refusee">Refusée</option>
                  <option value="archivee">Archivée</option>
                </select>
              </td>
              <td>
                <div className="contact-actions">
                  <a href={`mailto:${q.email}?subject=${subject}&body=${message}`} aria-label={`Envoyer un email à ${q.name}`} title="Ouvrir l’application email"><Mail /><span>Email</span></a>
                  {q.phone ? <a href={`sms:${q.phone.replace(/\s/g, "")}?body=${message}`} aria-label={`Envoyer un message à ${q.name}`} title="Ouvrir l’application Messages"><MessageCircle /><span>Message</span></a> : <span className="contact-disabled" title="Aucun numéro renseigné"><MessageCircle /><span>Message</span></span>}
                </div>
              </td>
            </tr>;
          })}
        </tbody>
      </table>
    </div>
  );
}

const pageElements: Record<PageKey, ReactNode> = {
  home: <Home />,
  portfolio: <PortfolioPage />,
  catalogue: <Catalogue />,
  about: <About />,
  location: <LocationPage />,
  contact: <ContactPage />,
  quote: <QuotePage />,
  mentions: <LegalPage kind="mentions" />,
  privacy: <LegalPage kind="privacy" />,
  terms: <LegalPage kind="terms" />,
  cookies: <LegalPage kind="cookies" />,
};

/* ───────── Réponse du client à une proposition de rendez-vous (lien reçu par email) ───────── */

const appointmentText = {
  fr: { eyebrow: "Votre rendez-vous", title: "Un moment rien qu’à vous", hello: "Bonjour {name}, voici le créneau proposé pour votre séance.", time: "Heure", duration: "Durée", place: "Lieu", confirm: "Confirmer ce rendez-vous", other: "Proposer une autre date", otherLabel: "Vos disponibilités", otherPlaceholder: "Ex. : plutôt en semaine après 16 h, ou le samedi matin…", send: "Envoyer", back: "Revenir au créneau proposé", confirmed: "Votre séance est confirmée", confirmedText: "Un email de confirmation avec l’invitation d’agenda vient de vous être envoyé. À très bientôt !", rescheduled: "Message bien reçu", rescheduledText: "Nous revenons vers vous rapidement avec un nouveau créneau.", invalid: "Ce lien n’est plus valable", invalidText: "Une nouvelle date vous a peut-être été proposée depuis : vérifiez vos derniers emails, ou répondez-nous directement.", loading: "Chargement…", home: "Retour au site", error: "Une erreur est survenue, merci de réessayer." },
  en: { eyebrow: "Your appointment", title: "A moment just for you", hello: "Hello {name}, here is the proposed time for your session.", time: "Time", duration: "Duration", place: "Location", confirm: "Confirm this appointment", other: "Suggest another date", otherLabel: "Your availability", otherPlaceholder: "E.g. weekdays after 4 pm, or Saturday mornings…", send: "Send", back: "Back to the proposed time", confirmed: "Your session is confirmed", confirmedText: "A confirmation email with a calendar invitation is on its way. See you soon!", rescheduled: "Message received", rescheduledText: "We’ll get back to you shortly with a new time.", invalid: "This link is no longer valid", invalidText: "A new date may have been proposed since: check your latest emails, or reply to us directly.", loading: "Loading…", home: "Back to the website", error: "Something went wrong, please try again." },
  es: { eyebrow: "Su cita", title: "Un momento solo para ustedes", hello: "Hola {name}, este es el horario propuesto para su sesión.", time: "Hora", duration: "Duración", place: "Lugar", confirm: "Confirmar la cita", other: "Proponer otra fecha", otherLabel: "Su disponibilidad", otherPlaceholder: "P. ej.: entre semana después de las 16 h, o el sábado por la mañana…", send: "Enviar", back: "Volver al horario propuesto", confirmed: "Su sesión está confirmada", confirmedText: "Le hemos enviado un correo de confirmación con la invitación de calendario. ¡Hasta muy pronto!", rescheduled: "Mensaje recibido", rescheduledText: "Le responderemos pronto con un nuevo horario.", invalid: "Este enlace ya no es válido", invalidText: "Es posible que se le haya propuesto una nueva fecha: revise sus últimos correos o respóndanos directamente.", loading: "Cargando…", home: "Volver a la web", error: "Se ha producido un error, inténtelo de nuevo." },
  de: { eyebrow: "Ihr Termin", title: "Ein Moment nur für Sie", hello: "Hallo {name}, hier ist der vorgeschlagene Termin für Ihr Shooting.", time: "Uhrzeit", duration: "Dauer", place: "Ort", confirm: "Termin bestätigen", other: "Anderen Termin vorschlagen", otherLabel: "Ihre Verfügbarkeit", otherPlaceholder: "Z. B. unter der Woche ab 16 Uhr oder samstagvormittags…", send: "Senden", back: "Zurück zum vorgeschlagenen Termin", confirmed: "Ihr Shooting ist bestätigt", confirmedText: "Eine Bestätigung mit Kalendereinladung ist unterwegs. Bis bald!", rescheduled: "Nachricht erhalten", rescheduledText: "Wir melden uns in Kürze mit einem neuen Termin.", invalid: "Dieser Link ist nicht mehr gültig", invalidText: "Vielleicht wurde Ihnen inzwischen ein neuer Termin vorgeschlagen: Prüfen Sie Ihre E-Mails oder antworten Sie uns direkt.", loading: "Wird geladen…", home: "Zurück zur Website", error: "Ein Fehler ist aufgetreten, bitte versuchen Sie es erneut." },
} satisfies Record<Lang, Record<string, string>>;
type PublicAppointment = { name: string; lang: Lang; status: "proposee" | "confirmee" | "a_replanifier"; at: string; duration: number; location: string; note?: string | null };
const dateLocales: Record<Lang, string> = { fr: "fr-FR", en: "en-GB", es: "es-ES", de: "de-DE" };

function AppointmentPage({ lang: urlLang }: { lang: Lang }) {
  const token = useLocation().pathname.split("/").pop() || "";
  const [params] = useSearchParams();
  const [appt, setAppt] = useState<PublicAppointment | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "invalid" | "confirmee" | "a_replanifier">("loading");
  const [other, setOther] = useState(params.get("action") === "autre-date");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    fetch(`/api/appointment?token=${encodeURIComponent(token)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: PublicAppointment) => {
        setAppt(data);
        setState(data.status === "proposee" ? "ready" : data.status);
      })
      .catch(() => setState("invalid"));
  }, [token]);
  const lang = appt?.lang ?? urlLang;
  const t = appointmentText[lang];
  async function respond(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setError("");
    const message = String(new FormData(e.currentTarget).get("message") || "");
    try {
      const response = await fetch("/api/appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: other ? "reschedule" : "confirm", token, message }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setState(result.status);
    } catch {
      setError(t.error);
    } finally {
      setSending(false);
    }
  }
  const home = lang === DEFAULT_LANG ? "/" : `/${lang}`;
  const duration = appt ? (appt.duration < 60 ? `${appt.duration} min` : `${Math.floor(appt.duration / 60)} h${appt.duration % 60 ? ` ${String(appt.duration % 60).padStart(2, "0")}` : ""}`) : "";
  return (
    <div className="admin-login appointment-page" lang={lang}>
      <Link className="wordmark" to={home}>
        L’instant <em>précieux</em>
      </Link>
      <form onSubmit={respond}>
        {state === "loading" && <p>{t.loading}</p>}
        {state === "invalid" && (
          <>
            <p className="eyebrow">{t.eyebrow}</p>
            <h1>{t.invalid}</h1>
            <p>{t.invalidText}</p>
          </>
        )}
        {(state === "confirmee" || state === "a_replanifier") && (
          <>
            <span className="appointment-check"><Check /></span>
            <p className="eyebrow">{t.eyebrow}</p>
            <h1>{state === "confirmee" ? t.confirmed : t.rescheduled}</h1>
            <p>{state === "confirmee" ? t.confirmedText : t.rescheduledText}</p>
          </>
        )}
        {state === "ready" && appt && (
          <>
            <p className="eyebrow">{t.eyebrow}</p>
            <h1>{t.title}</h1>
            <p>{t.hello.replace("{name}", appt.name)}</p>
            <div className="appointment-ticket">
              <strong>{new Date(appt.at).toLocaleDateString(dateLocales[lang], { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" })}</strong>
              <dl>
                <div><dt>{t.time}</dt><dd>{new Date(appt.at).toLocaleTimeString(dateLocales[lang], { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" })}</dd></div>
                <div><dt>{t.duration}</dt><dd>{duration}</dd></div>
                <div><dt>{t.place}</dt><dd>{appt.location}</dd></div>
              </dl>
            </div>
            {appt.note && <blockquote className="appointment-response">{appt.note}</blockquote>}
            {other && (
              <label>
                {t.otherLabel}
                <textarea name="message" rows={4} required placeholder={t.otherPlaceholder} />
              </label>
            )}
            {error && <p className="form-error">{error}</p>}
            <button className="button primary" disabled={sending}>
              {other ? t.send : t.confirm} <ArrowRight size={17} />
            </button>
            <button type="button" className="text-link appointment-switch" onClick={() => setOther(!other)}>
              {other ? t.back : t.other}
            </button>
          </>
        )}
        {state !== "ready" && state !== "loading" && <Link to={home}>{t.home}</Link>}
      </form>
    </div>
  );
}

/** Site public d’une langue : les chemins sont relatifs au préfixe de langue ("/", "/en/", …). */
function LocalizedSite({ lang }: { lang: Lang }) {
  return (
    <LangProvider lang={lang}>
      <Layout>
        <Routes>
          {(Object.keys(PAGES) as PageKey[]).map((page) =>
            page === "home" ? <Route key={page} index element={pageElements[page]} /> : <Route key={page} path={PAGES[page]} element={pageElements[page]} />,
          )}
          <Route path="*" element={<Navigate to={lang === DEFAULT_LANG ? "/" : `/${lang}`} replace />} />
        </Routes>
      </Layout>
    </LangProvider>
  );
}

export function PublicApp() {
  // Le premier rendu doit rester identique au HTML pré-rendu. Le cache navigateur
  // est appliqué après l’hydratation, puis remplacé par les données Supabase.
  const [data, setData] = useState({ services: seedServices, gallery: seedGallery });
  const refresh = async () => {
    const remote = await loadPublicContent();
    if (remote) {
      setData(remote);
      saveLocalServices(remote.services);
      saveLocalGallery(remote.gallery);
    }
  };
  useEffect(() => {
    setData(loadLocalContent({ services: seedServices, gallery: seedGallery }));
    void refresh();
  }, []);
  useSystemThemeSync();
  siteCache = { ...data, refresh };
  return (
    <>
      <ScrollTop />
      <HeadSync />
      <Routes>
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/rendez-vous/:token" element={<AppointmentPage lang={DEFAULT_LANG} />} />
        {LANGS.filter((lang) => lang !== DEFAULT_LANG).map((lang) => (
          <Route key={`rdv-${lang}`} path={`/${lang}/rendez-vous/:token`} element={<AppointmentPage lang={lang} />} />
        ))}
        <Route path={`/${DEFAULT_LANG}/*`} element={<Navigate to="/" replace />} />
        {LANGS.filter((lang) => lang !== DEFAULT_LANG).map((lang) => (
          <Route key={lang} path={`/${lang}/*`} element={<LocalizedSite lang={lang} />} />
        ))}
        <Route path="*" element={<LocalizedSite lang={DEFAULT_LANG} />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <PublicApp />
    </BrowserRouter>
  );
}
