require("dotenv").config();

const bcrypt = require("bcryptjs");
const pool = require("../config/db");

const run = async () => {
    const { ADMIN_USERNAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

    if (!ADMIN_USERNAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
        throw new Error(
            "ADMIN_USERNAME, ADMIN_EMAIL and ADMIN_PASSWORD must be set to seed the first admin."
        );
    }

    const existing = await pool.query(
        "SELECT id FROM users WHERE email = $1",
        [ADMIN_EMAIL]
    );

    if (existing.rows.length > 0) {
        console.log(`Admin ${ADMIN_EMAIL} already exists, skipping.`);
        return;
    }

    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

    await pool.query(
        `
        INSERT INTO users (username, email, password_hash, role)
        VALUES ($1, $2, $3, 'admin')
        `,
        [ADMIN_USERNAME, ADMIN_EMAIL, passwordHash]
    );

    console.log(`Admin ${ADMIN_EMAIL} created.`);
};

run()
    .catch((err) => {
        console.error(err.message);
        process.exitCode = 1;
    })
    .finally(() => pool.end());
