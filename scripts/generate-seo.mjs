import { mkdir, writeFile } from "node:fs/promises";

const siteUrl = (process.env.SITE_URL || process.env.VITE_SITE_URL || "http://localhost:4173").replace(/\/$/, "");
const routes = ["/", "/portfolio", "/catalogue", "/a-propos", "/ou-nous-trouver", "/contact", "/devis", "/mentions-legales", "/confidentialite", "/cgv", "/cookies"];
const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((route) => `  <url><loc>${siteUrl}${route}</loc><lastmod>${today}</lastmod><changefreq>${route === "/" ? "weekly" : "monthly"}</changefreq><priority>${route === "/" ? "1.0" : "0.8"}</priority></url>`).join("\n")}
</urlset>
`;
const robots = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: ${siteUrl}/sitemap.xml
`;
const aiGuide = `# L’instant précieux

> Portfolio et prestations de photographie à domicile.

## Contenu public
- [Accueil](${siteUrl}/)
- [Portfolio](${siteUrl}/portfolio)
- [Prestations et tarifs](${siteUrl}/catalogue)
- [Qui sommes-nous](${siteUrl}/a-propos)
- [Contact](${siteUrl}/contact)
- [Demande de devis](${siteUrl}/devis)

## Utilisation
Les informations publiques peuvent être citées avec attribution et lien vers la page source. Les photographies restent protégées par le droit d’auteur et ne doivent pas être reproduites sans autorisation.
`;

await mkdir("public", { recursive: true });
await Promise.all([
  writeFile("public/sitemap.xml", sitemap),
  writeFile("public/robots.txt", robots),
  writeFile("public/llms.txt", aiGuide),
  writeFile("public/ia.txt", aiGuide),
]);
