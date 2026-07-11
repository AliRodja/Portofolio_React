const pool = require("../config/db");

// GET semua pesan
const getAllMessages = async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT *
      FROM messages
      ORDER BY created_at DESC
    `);

        res.json(result.rows);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch messages",
        });
    }
};

// POST pesan baru
const createMessage = async (req, res) => {
    try {
        const {
            name,
            email,
            subject,
            message,
        } = req.body;

        const result = await pool.query(
            `
      INSERT INTO messages
      (
        name,
        email,
        subject,
        message
      )
      VALUES ($1,$2,$3,$4)
      RETURNING *
      `,
            [
                name,
                email,
                subject,
                message,
            ]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to send message",
        });

    }
};

// DELETE pesan
const deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `
            DELETE FROM messages
            WHERE id = $1
            RETURNING *
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Message not found",
            });
        }

        res.json({
            message: "Message deleted successfully",
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to delete message",
        });
    }
};

module.exports = {
    getAllMessages,
    createMessage,
    deleteMessage,
};