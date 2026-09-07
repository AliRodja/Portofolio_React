const { Pool } = require('pg');

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
