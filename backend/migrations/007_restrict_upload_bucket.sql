-- Defense in depth for the public "uploads" bucket: let Supabase Storage itself
-- reject anything that isn't an image/PDF or is over 4 MB, even for requests
-- made with the secret key. The backend already filters (middleware/upload.js);
-- this still holds if that key ever leaks, so the bucket can't be used to host
-- HTML pages (e.g. gambling spam) under this project's domain.
--
-- Keep in sync with ALLOWED_TYPES / limits in src/middleware/upload.js.
-- The storage schema only exists on Supabase, so skip on a plain local Postgres.
DO $$
BEGIN
    IF to_regclass('storage.buckets') IS NOT NULL THEN
        UPDATE storage.buckets
        SET allowed_mime_types = ARRAY[
                'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'
            ],
            file_size_limit = 4194304   -- 4 MB
        WHERE id = 'uploads';
    END IF;
END $$;
