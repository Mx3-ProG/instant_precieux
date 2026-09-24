import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { PublicApp } from "@/App";
import { LANGS, PAGES, dictionaries, localePath, parsePath, type PageKey } from "@/locales";
import { headTags, sitemap } from "@/seo";

/** Toutes les URL publiques à pré-rendre : chaque page dans chaque langue. */
export const routes = LANGS.flatMap((lang) => (Object.keys(PAGES) as PageKey[]).map((page) => localePath(lang, page)));

export function render(url: string) {
  const { lang } = parsePath(url);
  return {
    html: renderToString(
      <StaticRouter location={url}>
        <PublicApp />
      </StaticRouter>,
    ),
    head: headTags(url),
    htmlLang: dictionaries[lang].htmlLang,
  };
}

export { sitemap };
