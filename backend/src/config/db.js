const { Pool, types } = require('pg');

// Return DATE columns as plain "YYYY-MM-DD" strings. By default pg turns them
// into JS Dates at the *server's* local midnight, so the JSON depended on the
// server timezone (1 June became "2025-05-31T17:00:00Z" on a UTC+7 machine)
// and the dashboard's `.slice(0, 10)` saved dates back one day earlier.
const DATE_OID = 1082;
types.setTypeParser(DATE_OID, (value) => value);

// Managed Postgres (Supabase, Neon, Render...) memberi sertifikat self-signed,
// jadi rejectUnauthorized dimatikan.
const ssl = { rejectUnauthorized: false };

const pool = process.env.DATABASE_URL
    // Produksi: satu connection string (paling anti-typo).
    ? new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl,
    })
    // Lokal: field terpisah dari .env.
    : new Pool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        ssl: process.env.DB_SSL === 'true' ? ssl : false,
    });

module.exports = pool;
