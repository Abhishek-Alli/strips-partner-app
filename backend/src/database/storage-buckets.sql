-- ============================================================================
-- SHREE OM PLATFORM - STORAGE BUCKETS CONFIGURATION
-- ============================================================================
-- Run this in Supabase SQL Editor to configure storage buckets
-- ============================================================================

-- ============================================================================
-- CREATE STORAGE BUCKETS
-- ============================================================================

-- Admin uploads bucket (for CMS content, education, videos, etc.)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'admin-uploads',
  'admin-uploads',
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Dealer uploads bucket (for product images, catalog)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'dealer-uploads',
  'dealer-uploads',
  true,
  20971520, -- 20MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Partner uploads bucket (for works/portfolio, profile)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'partner-uploads',
  'partner-uploads',
  true,
  31457280, -- 30MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- User uploads bucket (for profile avatars, enquiry attachments)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'user-uploads',
  'user-uploads',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Tenders bucket (for tender documents)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'tenders',
  'tenders',
  true,
  52428800, -- 50MB limit
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'image/jpeg', 'image/png']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ============================================================================
-- STORAGE POLICIES
-- ============================================================================

-- ============================================================================
-- ADMIN UPLOADS BUCKET POLICIES
-- ============================================================================

-- Admin can upload to admin-uploads
CREATE POLICY "admin_upload_admin_bucket"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'admin-uploads' AND
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'ADMIN')
);

-- Admin can update files in admin-uploads
CREATE POLICY "admin_update_admin_bucket"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'admin-uploads' AND
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'ADMIN')
);

-- Admin can delete files in admin-uploads
CREATE POLICY "admin_delete_admin_bucket"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'admin-uploads' AND
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'ADMIN')
);

-- Public read access for admin-uploads (public bucket)
CREATE POLICY "public_read_admin_bucket"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'admin-uploads');

-- ============================================================================
-- DEALER UPLOADS BUCKET POLICIES
-- ============================================================================

-- Dealers can upload to their folder
CREATE POLICY "dealer_upload_own_folder"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'dealer-uploads' AND
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'DEALER') AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Dealers can update their files
CREATE POLICY "dealer_update_own_files"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'dealer-uploads' AND
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'DEALER') AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Dealers can delete their files
CREATE POLICY "dealer_delete_own_files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'dealer-uploads' AND
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'DEALER') AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Admin can manage all dealer files
CREATE POLICY "admin_all_dealer_bucket"
ON storage.objects FOR ALL
TO authenticated
USING (
  bucket_id = 'dealer-uploads' AND
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'ADMIN')
)
WITH CHECK (
  bucket_id = 'dealer-uploads' AND
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'ADMIN')
);

-- Public read access for dealer-uploads
CREATE POLICY "public_read_dealer_bucket"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'dealer-uploads');

-- ============================================================================
-- PARTNER UPLOADS BUCKET POLICIES
-- ============================================================================

-- Partners can upload to their folder
CREATE POLICY "partner_upload_own_folder"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'partner-uploads' AND
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'PARTNER') AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Partners can update their files
CREATE POLICY "partner_update_own_files"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'partner-uploads' AND
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'PARTNER') AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Partners can delete their files
CREATE POLICY "partner_delete_own_files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'partner-uploads' AND
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'PARTNER') AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Admin can manage all partner files
CREATE POLICY "admin_all_partner_bucket"
ON storage.objects FOR ALL
TO authenticated
USING (
  bucket_id = 'partner-uploads' AND
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'ADMIN')
)
WITH CHECK (
  bucket_id = 'partner-uploads' AND
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'ADMIN')
);

-- Public read access for partner-uploads
CREATE POLICY "public_read_partner_bucket"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'partner-uploads');

-- ============================================================================
-- USER UPLOADS BUCKET POLICIES
-- ============================================================================

-- Users can upload to their folder
CREATE POLICY "user_upload_own_folder"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'user-uploads' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can update their files
CREATE POLICY "user_update_own_files"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'user-uploads' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can delete their files
CREATE POLICY "user_delete_own_files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'user-uploads' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Admin can manage all user files
CREATE POLICY "admin_all_user_bucket"
ON storage.objects FOR ALL
TO authenticated
USING (
  bucket_id = 'user-uploads' AND
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'ADMIN')
)
WITH CHECK (
  bucket_id = 'user-uploads' AND
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'ADMIN')
);

-- Public read access for user-uploads
CREATE POLICY "public_read_user_bucket"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'user-uploads');

-- ============================================================================
-- TENDERS BUCKET POLICIES
-- ============================================================================

-- Admin can manage tenders
CREATE POLICY "admin_all_tenders_bucket"
ON storage.objects FOR ALL
TO authenticated
USING (
  bucket_id = 'tenders' AND
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'ADMIN')
)
WITH CHECK (
  bucket_id = 'tenders' AND
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'ADMIN')
);

-- Authenticated users can read tenders
CREATE POLICY "authenticated_read_tenders"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'tenders');

-- ============================================================================
-- END OF STORAGE CONFIGURATION
-- ============================================================================
