// Pré-rendu statique : génère une page HTML complète pour chaque URL publique
// (chaque page × chaque langue) afin que les moteurs de recherche lisent du contenu
// réel sans exécuter JavaScript. Lancé après `vite build` et `vite build --ssr`.
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const ssrDir = join(root, "dist-ssr");

const { render, routes, sitemap } = await import(pathToFileURL(join(ssrDir, "entry-server.js")).href);
const template = await readFile(join(dist, "index.html"), "utf8");
if (!template.includes("<!--seo-->") || !template.includes('<div id="root"></div>')) throw new Error("index.html : marqueurs de pré-rendu introuvables");

// Coquille vide (non indexable) servie pour l’administration et les URL inconnues.
const appShell = template.replace(
  /<!--seo-->[\s\S]*?<!--\/seo-->/,
  '<title>L’instant précieux</title>\n    <meta name="robots" content="noindex" />',
);
await writeFile(join(dist, "shell.html"), appShell);

// Avec cleanUrls, Vercel sert ces fichiers directement pour les routes admin.
// Les générer explicitement évite qu'une règle de fallback soit court-circuitée
// par la résolution des fichiers statiques.
await writeFile(join(dist, "admin.html"), appShell);
await mkdir(join(dist, "admin"), { recursive: true });
await writeFile(join(dist, "admin", "dashboard.html"), appShell);

for (const url of routes) {
  const { html, head, htmlLang } = render(url);
  const page = template
    .replace(/<html lang="[^"]*">/, `<html lang="${htmlLang}">`)
    .replace(/<!--seo-->[\s\S]*?<!--\/seo-->/, head)
    .replace('<div id="root"></div>', `<div id="root" data-prerendered="${url}">${html}</div>`);
  // "/" → index.html, "/portfolio" → portfolio.html, "/en/portfolio" → en/portfolio.html (servis sans extension via cleanUrls).
  const file = url === "/" ? "index.html" : `${url.slice(1)}.html`;
  await mkdir(dirname(join(dist, file)), { recursive: true });
  await writeFile(join(dist, file), page);
}

await writeFile(join(dist, "sitemap.xml"), sitemap());
await rm(ssrDir, { recursive: true, force: true });
console.log(`Pré-rendu : ${routes.length} pages + sitemap.xml`);
