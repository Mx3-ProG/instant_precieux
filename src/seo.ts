import { DEFAULT_LANG, LANGS, dictionaries, localePath, parsePath } from "@/locales";
import { services } from "@/content";

export const SITE_URL = String(import.meta.env.VITE_SITE_URL || "https://linstantprecieux.fr").replace(/\/$/, "");
const CONTACT_EMAIL = "bonjour@linstantprecieux.fr";

const esc = (value: string) => value.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
const absolute = (path: string) => `${SITE_URL}${path === "/" ? "/" : path}`;

/**
 * Balises <head> propres à une URL (titre, description, canonical, hreflang, Open Graph, JSON-LD).
 * Partagé entre le pré-rendu (build) et la navigation côté navigateur.
 * Chaque balise porte data-seo pour pouvoir être remplacée lors d’un changement de page.
 */
export function headTags(pathname: string) {
  const { lang, page } = parsePath(pathname);
  const t = dictionaries[lang];
  if (!page) return `<title data-seo>${esc(t.meta.siteName)}</title>\n<meta data-seo name="robots" content="noindex, nofollow" />`;

  const meta = t.meta.pages[page];
  const url = absolute(localePath(lang, page));
  const image = `${SITE_URL}/og-image.jpg`;
  const tags = [
    `<title data-seo>${esc(meta.title)}</title>`,
    `<meta data-seo name="description" content="${esc(meta.description)}" />`,
    `<meta data-seo name="robots" content="index, follow, max-image-preview:large" />`,
    `<link data-seo rel="canonical" href="${url}" />`,
    ...LANGS.map((l) => `<link data-seo rel="alternate" hreflang="${dictionaries[l].htmlLang}" href="${absolute(localePath(l, page))}" />`),
    `<link data-seo rel="alternate" hreflang="x-default" href="${absolute(localePath(DEFAULT_LANG, page))}" />`,
    `<meta data-seo property="og:type" content="website" />`,
    `<meta data-seo property="og:site_name" content="${esc(t.meta.siteName)}" />`,
    `<meta data-seo property="og:title" content="${esc(meta.title)}" />`,
    `<meta data-seo property="og:description" content="${esc(meta.description)}" />`,
    `<meta data-seo property="og:url" content="${url}" />`,
    `<meta data-seo property="og:image" content="${image}" />`,
    `<meta data-seo property="og:image:type" content="image/jpeg" />`,
    `<meta data-seo property="og:image:width" content="1200" />`,
    `<meta data-seo property="og:image:height" content="630" />`,
    `<meta data-seo property="og:image:alt" content="${esc(t.meta.siteName)}" />`,
    `<meta data-seo property="og:locale" content="${t.ogLocale}" />`,
    ...LANGS.filter((l) => l !== lang).map((l) => `<meta data-seo property="og:locale:alternate" content="${dictionaries[l].ogLocale}" />`),
    `<meta data-seo name="twitter:card" content="summary_large_image" />`,
    `<meta data-seo name="twitter:title" content="${esc(meta.title)}" />`,
    `<meta data-seo name="twitter:description" content="${esc(meta.description)}" />`,
    `<meta data-seo name="twitter:image" content="${image}" />`,
    `<meta data-seo name="twitter:image:alt" content="${esc(t.meta.siteName)}" />`,
  ];

  if (page === "home") {
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "@id": `${SITE_URL}/#business`,
      name: t.meta.siteName,
      url,
      image,
      logo: `${SITE_URL}/logo.png`,
      email: CONTACT_EMAIL,
      description: meta.description,
      inLanguage: t.htmlLang,
      priceRange: `${Math.min(...services.map((s) => s.price))} € – ${Math.max(...services.map((s) => s.price))} €`,
      knowsLanguage: LANGS.map((l) => dictionaries[l].htmlLang),
      makesOffer: services.map((s) => ({
        "@type": "Offer",
        name: t.services[s.id]?.name ?? s.name,
        description: t.services[s.id]?.description ?? s.description,
        price: s.price,
        priceCurrency: "EUR",
      })),
    };
    tags.push(`<script data-seo type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, "\\u003c")}</script>`);
  }
  return tags.join("\n    ");
}

/** Sitemap multilingue : chaque URL déclare ses variantes hreflang. */
export function sitemap() {
  const pages = Object.keys(dictionaries.fr.meta.pages) as (keyof typeof dictionaries.fr.meta.pages)[];
  const urls = pages.flatMap((page) =>
    LANGS.map((lang) => {
      const alternates = LANGS.map((l) => `    <xhtml:link rel="alternate" hreflang="${dictionaries[l].htmlLang}" href="${absolute(localePath(l, page))}"/>`);
      alternates.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${absolute(localePath(DEFAULT_LANG, page))}"/>`);
      const priority = lang === DEFAULT_LANG ? (page === "home" ? "1.0" : "0.8") : page === "home" ? "0.6" : "0.5";
      return `  <url>\n    <loc>${absolute(localePath(lang, page))}</loc>\n${alternates.join("\n")}\n    <priority>${priority}</priority>\n  </url>`;
    }),
  );
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join("\n")}\n</urlset>\n`;
}
