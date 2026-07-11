-- Hero section needs its own short introduction, independent from the
-- longer "about" text used in the About section further down the page.
ALTER TABLE profile ADD COLUMN IF NOT EXISTS short_bio TEXT;

UPDATE profile SET short_bio = about WHERE short_bio IS NULL;
