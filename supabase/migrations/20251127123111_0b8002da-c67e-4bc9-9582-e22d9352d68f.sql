-- Create videos storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('videos', 'videos', true)
ON CONFLICT (id) DO UPDATE SET public = excluded.public;

-- Create images storage bucket for portfolio images
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO UPDATE SET public = excluded.public;

-- RLS policies for videos bucket - public read access
CREATE POLICY "Videos are publicly accessible"
ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'videos');

-- Allow authenticated users to upload videos
CREATE POLICY "Authenticated users can upload videos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'videos' AND (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Allow authenticated users to update their videos
CREATE POLICY "Authenticated users can update videos"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'videos' AND (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
WITH CHECK (bucket_id = 'videos' AND (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Allow authenticated users to delete videos
CREATE POLICY "Authenticated users can delete videos"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'videos' AND (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- RLS policies for images bucket - public read access
CREATE POLICY "Images are publicly accessible"
ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'images' AND (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Allow authenticated users to update their images
CREATE POLICY "Authenticated users can update images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'images' AND (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
WITH CHECK (bucket_id = 'images' AND (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Allow authenticated users to delete images
CREATE POLICY "Authenticated users can delete images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'images' AND (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
