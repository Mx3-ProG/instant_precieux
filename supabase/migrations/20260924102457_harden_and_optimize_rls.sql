-- Les fonctions de sécurité ne doivent pas être exposées par l'API REST.
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;

-- Évaluer le JWT une seule fois par requête et éviter plusieurs politiques
-- permissives pour une même action.
drop policy if exists "Admins read page analytics" on public.page_views;
drop policy if exists "Admins delete page analytics" on public.page_views;
create policy "Admins read page analytics" on public.page_views
  for select to authenticated
  using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');
create policy "Admins delete page analytics" on public.page_views
  for delete to authenticated
  using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Published services are public" on public.services;
drop policy if exists "Admins manage services" on public.services;
create policy "Published services are public" on public.services
  for select to anon
  using (published = true);
create policy "Services visible to signed-in users" on public.services
  for select to authenticated
  using (published = true or ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');
create policy "Admins insert services" on public.services
  for insert to authenticated
  with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');
create policy "Admins update services" on public.services
  for update to authenticated
  using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
  with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');
create policy "Admins delete services" on public.services
  for delete to authenticated
  using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Published gallery is public" on public.gallery_items;
drop policy if exists "Admins manage gallery" on public.gallery_items;
create policy "Published gallery is public" on public.gallery_items
  for select to anon
  using (published = true);
create policy "Gallery visible to signed-in users" on public.gallery_items
  for select to authenticated
  using (published = true or ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');
create policy "Admins insert gallery" on public.gallery_items
  for insert to authenticated
  with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');
create policy "Admins update gallery" on public.gallery_items
  for update to authenticated
  using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
  with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');
create policy "Admins delete gallery" on public.gallery_items
  for delete to authenticated
  using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Admins read quotes" on public.quote_requests;
drop policy if exists "Admins update quotes" on public.quote_requests;
drop policy if exists "Admins delete quotes" on public.quote_requests;
create policy "Admins read quotes" on public.quote_requests
  for select to authenticated
  using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');
create policy "Admins update quotes" on public.quote_requests
  for update to authenticated
  using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
  with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');
create policy "Admins delete quotes" on public.quote_requests
  for delete to authenticated
  using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');
