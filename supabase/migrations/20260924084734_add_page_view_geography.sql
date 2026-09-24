alter table if exists public.page_views
  add column if not exists country_code text,
  add column if not exists region text,
  add column if not exists city text,
  add column if not exists latitude numeric(4, 1),
  add column if not exists longitude numeric(5, 1);

comment on column public.page_views.country_code is 'Code pays ISO 3166-1 fourni par Vercel, sans conservation de l adresse IP.';
comment on column public.page_views.latitude is 'Latitude approximative Vercel arrondie a un chiffre apres la virgule.';
comment on column public.page_views.longitude is 'Longitude approximative Vercel arrondie a un chiffre apres la virgule.';

create index if not exists page_views_country_code_idx
  on public.page_views (country_code)
  where country_code is not null;
