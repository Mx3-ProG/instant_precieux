import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const metadata: Record<string, { title: string; description: string }> = {
  "/": { title: "Photographe à domicile", description: "Photographe à domicile pour vos souvenirs de grossesse, naissance, famille et mariage." },
  "/portfolio": { title: "Portfolio", description: "Découvrez des séances photo naturelles, élégantes et sincères réalisées à domicile." },
  "/catalogue": { title: "Prestations et tarifs", description: "Formules et tarifs des séances photo à domicile de L’instant précieux." },
  "/a-propos": { title: "Qui sommes-nous", description: "Découvrez l’approche douce et naturelle de L’instant précieux." },
  "/ou-nous-trouver": { title: "Où nous trouver", description: "Zone d’intervention et informations pratiques pour votre séance photo à domicile." },
  "/contact": { title: "Contact", description: "Contactez L’instant précieux pour préparer votre séance photo." },
  "/devis": { title: "Demande de devis", description: "Demandez votre devis personnalisé pour une séance photo à domicile." },
};

function upsertMeta(name: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!element) { element = document.createElement("meta"); element.name = name; document.head.appendChild(element); }
  element.content = content;
}

export default function SeoManager() {
  const { pathname } = useLocation();
  useEffect(() => {
    const current = metadata[pathname] || { title: "L’instant précieux", description: "Photographie naturelle à domicile." };
    const baseUrl = (import.meta.env.VITE_SITE_URL || window.location.origin).replace(/\/$/, "");
    document.title = `${current.title} | L’instant précieux`;
    upsertMeta("description", current.description);
    upsertMeta("robots", pathname.startsWith("/admin") ? "noindex,nofollow" : "index,follow,max-image-preview:large");
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.appendChild(canonical); }
    canonical.href = `${baseUrl}${pathname}`;
    let schema = document.head.querySelector<HTMLScriptElement>('script[data-seo-schema]');
    if (!schema) { schema = document.createElement("script"); schema.type = "application/ld+json"; schema.dataset.seoSchema = "true"; document.head.appendChild(schema); }
    schema.textContent = JSON.stringify({ "@context": "https://schema.org", "@type": "ProfessionalService", name: "L’instant précieux", url: baseUrl, description: metadata["/"].description, email: "bonjour@linstantprecieux.fr", priceRange: "50€–150€" });
  }, [pathname]);
  return null;
}
