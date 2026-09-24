# Design QA — L'instant précieux V1.2

- Source visual truth: `/tmp/instant-precieux-video/frame-0.png`, `/tmp/instant-precieux-video/frame-10.png`, `/tmp/instant-precieux-video/frame-20.png`, `/tmp/instant-precieux-video/frame-25.png`, `/tmp/instant-precieux-video/frame-29.png`
- Implementation: `http://192.168.1.165:4173/` inspected in the Codex in-app browser
- Viewports: 1440 × 1000 desktop and 390 × 844 mobile, device scale factor 1
- Source: 416 × 832 mobile video frames
- State: public home, mobile navigation, quote form, admin login, dashboard overview, portfolio editor and service editor
- Browser-rendered evidence: in-app browser captures inspected during QA; the browser runtime does not expose a persistent screenshot path

## Findings and comparison history

1. Initial pass — blocked
   - P1: navigation from the public app to the dashboard crashed because `ScrollTop` returned the browser's scroll result as an effect cleanup.
   - P1: demo quote persistence failed on a non-secure local origin because `crypto.randomUUID()` was unavailable.
   - Fixes: changed the scroll effect to return nothing and added a safe local ID fallback.
   - Post-fix evidence: dashboard rendered with overview statistics and all admin navigation; portfolio add modal and service edit modal opened successfully.

2. Itération dashboard et accueil — corrigée
   - Hero remplacé par une vidéo réelle de photographe, optimisée en boucle de cinq secondes, avec titre et accroche centrés.
   - Les six cartes de prestations sont désormais des liens complets, utilisables au clic, au clavier et au toucher.
   - Le formulaire de devis a été restructuré en trois panneaux translucides avec hiérarchie, icônes et focus visibles.
   - La navigation admin mobile comporte cinq destinations, dont un bouton Accueil central surélevé.
   - Vue d'ensemble enrichie avec visiteurs, pages vues, courbe sur sept jours et classement des pages.
   - Le premier prototype de graphique fondé sur Recharts a provoqué une erreur de hook pendant le rechargement à chaud. Il a été remplacé par un SVG natif, sans dépendance d'exécution supplémentaire.

3. Final pass — passed
   - Fonts and typography: Instrument Serif closely matches the high-contrast editorial serif in the source; DM Sans provides clearer interface and body copy.
   - Spacing and layout: the source's generous mobile whitespace and stacked cards are retained, while desktop expands into editorial grids.
   - Colors and tokens: ivory, paper white, warm bronze and deep brown remain consistent with the video.
   - Image quality: real photographic assets from the provided portfolio template are used, resized for web delivery without placeholder imagery.
   - Copy and content: the source categories, key messaging, €50/€100/€150 prices and €15 USB option are retained.
   - Responsive behavior: mobile hero, menu and stacked pricing were visually inspected at 390 × 844; desktop navigation and layout were inspected at 1440 × 1000.
   - Primary interactions: mobile menu, portfolio filters, quote form validation, demo admin login, admin navigation, add-photo modal and service edit modal were exercised.
   - Console: aucune erreur applicative après rechargement propre. Les future flags React Router sont activés.
   - SEO: titres et descriptions par route, canonical, JSON-LD, sitemap, robots.txt, llms.txt et ia.txt générés.

4. Administration de contenu — passed
   - Portfolio : ouverture du dialogue mobile vérifiée, zone de glisser-déposer visible, types et poids annoncés, champs titre/catégorie/texte alternatif/description accessibles, aucune saisie d'URL exposée.
   - Catalogue : ouverture du dialogue d'ajout vérifiée ; chaque prestation publiée affiche les actions Modifier et Supprimer.
   - Synchronisation : les écritures Supabase et le cache de démonstration alimentent la même collection consommée par le site public.
   - Relance : les demandes disposent de liens `mailto:` et `sms:` préremplis ; le message est désactivé proprement en l'absence de numéro.
   - Mobile : les dialogues ont été inspectés à 666 × 585 et la barre fixe à cinq entrées reste accessible.
   - Qualité : `npm run type-check`, `npm run lint` et `npm run build` terminent sans erreur (les avertissements lint restants sont antérieurs et non bloquants).

## Follow-up polish

- Replace demonstration photography with the client's final exports.
- Replace the provisional location block with the confirmed studio address and map.
- Complete legal identity fields before publishing.

final result: passed
