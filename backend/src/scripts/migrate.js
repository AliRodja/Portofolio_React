require("dotenv").config();

const fs = require("fs");
const path = require("path");
const pool = require("../config/db");

const MIGRATIONS_DIR = path.join(__dirname, "..", "..", "migrations");

const run = async () => {
    const client = await pool.connect();

    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS schema_migrations (
                filename VARCHAR(255) PRIMARY KEY,
                applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            )
        `);

        const applied = await client.query("SELECT filename FROM schema_migrations");
        const appliedSet = new Set(applied.rows.map((row) => row.filename));

        const files = fs
            .readdirSync(MIGRATIONS_DIR)
            .filter((file) => file.endsWith(".sql"))
            .sort();

        for (const file of files) {
            if (appliedSet.has(file)) {
                console.log(`skip  ${file} (already applied)`);
                continue;
            }

            const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), "utf8");

            console.log(`apply ${file}`);

            try {
                await client.query("BEGIN");
                await client.query(sql);
                await client.query(
                    "INSERT INTO schema_migrations (filename) VALUES ($1)",
                    [file]
                );
                await client.query("COMMIT");
            } catch (err) {
                await client.query("ROLLBACK");
                throw new Error(`Migration ${file} failed: ${err.message}`);
            }
        }

        console.log("Migrations up to date.");
    } finally {
        client.release();
        await pool.end();
    }
};

run().catch((err) => {
    console.error(err.message);
    process.exit(1);
});
