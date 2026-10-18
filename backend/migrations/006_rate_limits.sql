-- Shared hit counters for express-rate-limit.
--
-- On Vercel every serverless instance has its own memory, so the default
-- in-memory store let each instance count separately (and forget on cold
-- start). Keeping the counters in Postgres makes the limit global.
CREATE TABLE IF NOT EXISTS rate_limits (
    key      TEXT PRIMARY KEY,          -- "<limiter prefix><client ip>"
    hits     INTEGER NOT NULL,
    reset_at TIMESTAMPTZ NOT NULL       -- when the current window ends
);

-- Same lockdown as 005: backend only, never exposed through the Data API.
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
        REVOKE ALL ON rate_limits FROM anon, authenticated;
    END IF;
END $$;
