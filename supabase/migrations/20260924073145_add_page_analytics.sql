create table if not exists public.page_views (
  id uuid primary key default gen_random_uuid(),
  path text not null check (char_length(path) <= 180),
  page_title text not null default '',
  visitor_id text not null check (char_length(visitor_id) <= 80),
  referrer text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists page_views_created_at_idx on public.page_views (created_at desc);
create index if not exists page_views_path_idx on public.page_views (path);

alter table public.page_views enable row level security;
revoke all on public.page_views from anon, authenticated;
grant select, delete on public.page_views to authenticated;

create policy "Admins read page analytics" on public.page_views
  for select to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "Admins delete page analytics" on public.page_views
  for delete to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
