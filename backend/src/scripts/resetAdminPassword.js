require("dotenv").config();

const bcrypt = require("bcryptjs");
const pool = require("../config/db");

// Ganti password admin yang SUDAH ADA.
// Isi ADMIN_EMAIL (admin yang mau diubah) dan ADMIN_PASSWORD (password baru)
// di .env, lalu jalankan: npm run reset:admin
const run = async () => {
    const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
        throw new Error(
            "ADMIN_EMAIL and ADMIN_PASSWORD must be set to reset the admin password."
        );
    }

    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

    const result = await pool.query(
        "UPDATE users SET password_hash = $1 WHERE email = $2 RETURNING id",
        [passwordHash, ADMIN_EMAIL]
    );

    if (result.rows.length === 0) {
        throw new Error(`No user found with email ${ADMIN_EMAIL}.`);
    }

    console.log(`Password for ${ADMIN_EMAIL} updated.`);
};

run()
    .catch((err) => {
        console.error(err.message);
        process.exitCode = 1;
    })
    .finally(() => pool.end());
