const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Hash of a random string nobody knows, same cost (10) as real passwords.
// Login compares against it when the email doesn't exist, so an unknown email
// takes as long as a wrong password and response time can't reveal which
// emails are registered. Hard-coded so cold starts don't pay for hashing.
const DUMMY_HASH = "$2b$10$Ti4R8XSCQ3EnKhpoWPcX0ut.PhVMG80AcrDpksmE1gMerfnINK9Su";

const register = async (req, res) => {
    try {
        const {
            username,
            email,
            password,
        } = req.body;

        // username is UNIQUE too, so check it here instead of letting the
        // INSERT fail with a 500.
        const userExists = await pool.query(
            "SELECT id FROM users WHERE email = $1 OR username = $2",
            [email, username]
        );

        if (userExists.rows.length > 0) {
            return res.status(400).json({
                message: "Email or username already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `
      INSERT INTO users
      (
        username,
        email,
        password_hash
      )
      VALUES ($1,$2,$3)
      RETURNING id, username, email, role
      `,
            [
                username,
                email,
                hashedPassword,
            ]
        );

        res.status(201).json(result.rows[0]);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Register failed",
        });

    }
};

const login = async (req, res) => {

    try {

        const {
            email,
            password,
        } = req.body;

        const result = await pool.query(
            `
      SELECT *
      FROM users
      WHERE email = $1
      `,
            [email]
        );

        const user = result.rows[0];

        // Always run bcrypt, even for an unknown email (see DUMMY_HASH).
        const isMatch = await bcrypt.compare(
            password,
            user ? user.password_hash : DUMMY_HASH
        );

        if (!user || !isMatch) {
            return res.status(401).json({
                message: "Invalid credentials",
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                username: user.username,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || '1d',
            }
        );

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Login failed",
        });

    }

};

module.exports = {
    register,
    login,
};