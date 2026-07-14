const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    try {
        const {
            username,
            email,
            password,
        } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        const userExists = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [email]
        );

        if (userExists.rows.length > 0) {
            return res.status(400).json({
                message: "Email already exists",
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

        if (result.rows.length === 0) {
            return res.status(401).json({
                message: "Invalid credentials",
            });
        }

        const user = result.rows[0];

        const isMatch = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!isMatch) {
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
                expiresIn: process.env.JWT_EXPIRES_IN || '7d',
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