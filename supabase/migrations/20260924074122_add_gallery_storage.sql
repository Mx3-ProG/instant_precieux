insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('gallery', 'gallery', true, 10485760, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Admins upload gallery images" on storage.objects;
drop policy if exists "Admins view gallery objects" on storage.objects;
drop policy if exists "Admins update gallery images" on storage.objects;
drop policy if exists "Admins delete gallery images" on storage.objects;

create policy "Admins upload gallery images" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'gallery' and (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "Admins view gallery objects" on storage.objects
  for select to authenticated
  using (bucket_id = 'gallery' and (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "Admins update gallery images" on storage.objects
  for update to authenticated
  using (bucket_id = 'gallery' and (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check (bucket_id = 'gallery' and (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "Admins delete gallery images" on storage.objects
  for delete to authenticated
  using (bucket_id = 'gallery' and (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
