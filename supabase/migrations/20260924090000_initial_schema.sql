create extension if not exists pgcrypto;

create table if not exists public.services (
  id text primary key,
  name text not null,
  price numeric(10,2) not null check (price >= 0),
  description text not null default '',
  photo_count integer not null default 0 check (photo_count >= 0),
  usb_included boolean not null default false,
  published boolean not null default true,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  description text not null default '',
  image_url text not null,
  alt_text text not null,
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null default '',
  city text not null,
  category text not null,
  service_id text references public.services(id) on delete set null,
  preferred_date date,
  people_count integer not null default 1 check (people_count between 1 and 50),
  message text not null,
  status text not null default 'nouvelle' check (status in ('nouvelle','acceptee','refusee','archivee')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.services enable row level security;
alter table public.gallery_items enable row level security;
alter table public.quote_requests enable row level security;

revoke all on public.services, public.gallery_items, public.quote_requests from anon, authenticated;
grant select on public.services, public.gallery_items to anon, authenticated;
grant insert, update, delete on public.services, public.gallery_items to authenticated;
grant select, update, delete on public.quote_requests to authenticated;

create policy "Published services are public" on public.services for select to anon, authenticated using (published = true or (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy "Admins manage services" on public.services for all to authenticated using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin') with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy "Published gallery is public" on public.gallery_items for select to anon, authenticated using (published = true or (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy "Admins manage gallery" on public.gallery_items for all to authenticated using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin') with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy "Admins read quotes" on public.quote_requests for select to authenticated using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy "Admins update quotes" on public.quote_requests for update to authenticated using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin') with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy "Admins delete quotes" on public.quote_requests for delete to authenticated using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

insert into public.services (id,name,price,description,photo_count,usb_included,sort_order) values
('mini','Mini',50,'Un format essentiel pour conserver quelques instants choisis.',5,false,1),
('souvenir','Souvenir',100,'Une séance complète, douce et spontanée, réalisée à domicile.',15,false,2),
('famille','Famille',150,'Davantage d''images pour raconter les liens et les gestes qui vous ressemblent.',25,true,3)
on conflict (id) do update set name=excluded.name, price=excluded.price, description=excluded.description, photo_count=excluded.photo_count, usb_included=excluded.usb_included, sort_order=excluded.sort_order;
