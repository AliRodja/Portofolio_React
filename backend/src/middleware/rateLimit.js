const rateLimit = require("express-rate-limit");
const pool = require("../config/db");

/**
 * express-rate-limit store backed by the `rate_limits` table (migration 006).
 *
 * The default MemoryStore keeps counters inside one process. On Vercel each
 * serverless instance is its own process and is thrown away when idle, so
 * the limit was effectively per-instance. Postgres is shared by all of them.
 */
class PostgresStore {
    constructor(prefix) {
        // Distinct prefix per limiter so login and contact-form hits from the
        // same IP are counted separately.
        this.prefix = prefix;
        this.localKeys = false;
    }

    init(options) {
        this.windowMs = options.windowMs;
    }

    async increment(key) {
        // One atomic statement: start a new window if the old one expired,
        // otherwise add a hit to the current one.
        const result = await pool.query(
            `
            INSERT INTO rate_limits (key, hits, reset_at)
            VALUES ($1, 1, NOW() + $2 * INTERVAL '1 millisecond')
            ON CONFLICT (key) DO UPDATE SET
                hits = CASE WHEN rate_limits.reset_at <= NOW()
                            THEN 1 ELSE rate_limits.hits + 1 END,
                reset_at = CASE WHEN rate_limits.reset_at <= NOW()
                                THEN EXCLUDED.reset_at ELSE rate_limits.reset_at END
            RETURNING hits, reset_at
            `,
            [this.prefix + key, this.windowMs]
        );

        // Occasionally sweep out windows that ended long ago so the table
        // doesn't grow forever (one row per IP that ever hit a limiter).
        if (Math.random() < 0.01) {
            pool.query("DELETE FROM rate_limits WHERE reset_at < NOW() - INTERVAL '1 day'")
                .catch((err) => console.error("rate_limits cleanup failed:", err));
        }

        return {
            totalHits: result.rows[0].hits,
            resetTime: result.rows[0].reset_at,
        };
    }

    async decrement(key) {
        await pool.query(
            "UPDATE rate_limits SET hits = GREATEST(hits - 1, 0) WHERE key = $1",
            [this.prefix + key]
        );
    }

    async resetKey(key) {
        await pool.query("DELETE FROM rate_limits WHERE key = $1", [this.prefix + key]);
    }
}

const commonOptions = {
    windowMs: 15 * 60 * 1000,
    standardHeaders: true,
    legacyHeaders: false,
    // If the database is unreachable, let the request through instead of
    // failing it — the route itself will report the DB error anyway.
    passOnStoreError: true,
};

// Login brute-force protection. Only FAILED attempts count, so a correct
// login never locks the admin out.
const authLimiter = rateLimit({
    ...commonOptions,
    limit: 10,
    skipSuccessfulRequests: true,
    store: new PostgresStore("auth:"),
    message: { message: "Too many attempts. Please try again later." },
});

// Public contact form spam protection. Applied only to POST /api/messages,
// so the admin reading/deleting messages is never throttled.
const messageLimiter = rateLimit({
    ...commonOptions,
    limit: 5,
    store: new PostgresStore("message:"),
    message: { message: "Too many messages sent. Please try again later." },
});

module.exports = { authLimiter, messageLimiter };
