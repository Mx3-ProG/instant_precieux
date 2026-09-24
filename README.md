# L'instant précieux — V1

Portfolio et catalogue de prestations photographiques construit avec React, Vite, Supabase, Resend et Vercel.

La boucle vidéo du hero est dérivée du clip libre [Photographer taking photos in a desert](https://mixkit.co/free-stock-video/photographer-taking-photos-in-a-desert-34398/) sous licence Mixkit Stock Video Free.

## Lancer le projet

```bash
npm install
cp .env.example .env.local
npm run dev
```

Sans variables d'environnement, le site fonctionne en mode démonstration : le formulaire enregistre les demandes dans le navigateur et l'administration accepte les identifiants préremplis.

## Connexion Supabase

1. Créer un projet Supabase.
2. Exécuter les migrations du dossier `supabase/migrations` dans l'ordre depuis la CLI ou le SQL Editor.
3. Créer l'utilisateur administrateur dans Supabase Auth.
4. Ajouter `{ "role": "admin" }` à son `app_metadata` côté serveur.
5. Renseigner `VITE_SUPABASE_URL` et `VITE_SUPABASE_PUBLISHABLE_KEY`.

La migration active RLS, limite la lecture publique aux contenus publiés et réserve toutes les opérations d'administration aux comptes portant le rôle `admin` dans `app_metadata`.

Elle crée aussi le bucket public `gallery` : l'administrateur peut y déposer une image par glisser-déposer depuis le dashboard. Le navigateur redimensionne l'original à 2 200 px maximum et le convertit en WebP avant l'envoi. Les ajouts et suppressions du portfolio et du catalogue sont ensuite répercutés sur le site public.

Dans le dashboard :

- **Portfolio** accepte les fichiers JPG, PNG et WebP jusqu'à 10 Mo, avec titre, catégorie, texte alternatif et description ;
- **Prestations** permet d'ajouter, modifier ou supprimer une offre ;
- **Demandes** propose des raccourcis Email et Message préremplis pour relancer le prospect (le raccourci Message apparaît désactivé si aucun téléphone n'a été fourni).

## Emails et déploiement Vercel

Installer Resend depuis le Vercel Marketplace ou créer une clé Resend, puis configurer dans Vercel :

- `SUPABASE_URL`
- `SUPABASE_SECRET_KEY` (serveur uniquement)
- `RESEND_API_KEY`
- `EMAIL_FROM`
- `ADMIN_EMAIL`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_STUDIO_ADDRESS`
- `SITE_URL` et `VITE_SITE_URL` avec le domaine public définitif

La fonction `api/quote.ts` enregistre la demande, envoie un accusé de réception au visiteur et une notification détaillée à l'administrateur.

La fonction `api/track.ts` enregistre la page, un identifiant pseudonyme généré dans le navigateur, la date et une localisation approximative fournie par Vercel (pays, région, ville et coordonnées arrondies). Elle ne stocke pas d'adresse IP brute. Le dashboard affiche les visiteurs, les pages vues, une courbe sur sept jours, le classement des pages et un globe 3D interactif des provenances.

Le build génère automatiquement `robots.txt`, `sitemap.xml`, `llms.txt` et `ia.txt` avec le domaine fourni dans `SITE_URL`.

## Vérifications

```bash
npm run type-check
npm run lint
npm run build
```

Avant publication, compléter les informations juridiques, l'adresse, l'email définitif, le domaine d'envoi Resend et remplacer les images de démonstration par les photographies du client.
