-- Lock the database down to the backend only.
--
-- Supabase exposes every table in the `public` schema through its Data API
-- (PostgREST) to the `anon` and `authenticated` roles. This app never uses
-- that API — the Express backend connects directly as `postgres`, which owns
-- these tables and has BYPASSRLS — so nobody else should be able to touch them.
--
-- 1) Enable RLS with no policies: deny-by-default for anon/authenticated.
ALTER TABLE users             ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile           ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects          ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills            ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences       ENABLE ROW LEVEL SECURITY;
ALTER TABLE education         ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates      ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links      ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages          ENABLE ROW LEVEL SECURITY;
ALTER TABLE schema_migrations ENABLE ROW LEVEL SECURITY;

-- 2) Remove the table/sequence privileges Supabase granted by default,
--    so access is blocked even if RLS were ever switched off by mistake.
REVOKE ALL ON ALL TABLES    IN SCHEMA public FROM anon, authenticated;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon, authenticated;

-- 3) Stop future tables created by `postgres` (i.e. later migrations) from
--    being granted to anon/authenticated automatically.
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
    REVOKE ALL ON TABLES    FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
    REVOKE ALL ON SEQUENCES FROM anon, authenticated;
