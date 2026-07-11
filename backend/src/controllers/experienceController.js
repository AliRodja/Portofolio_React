const pool = require('../config/db');

const getAllExperiences = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT *
            FROM experiences
            ORDER BY start_date DESC
        `);

        res.json(result.rows);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Failed to fetch experiences'
        });
    }
};

const createExperience = async (req, res) => {
    try {
        const { position, organization, start_date, end_date, description, image_url } = req.body;

        const result = await pool.query(
            `
            INSERT INTO experiences (position, organization, start_date, end_date, description, image_url)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
            `,
            [position, organization, start_date, end_date || null, description, image_url || null]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Failed to create experience'
        });
    }
};

const updateExperience = async (req, res) => {
    try {
        const { id } = req.params;
        const { position, organization, start_date, end_date, description, image_url } = req.body;

        const result = await pool.query(
            `
            UPDATE experiences
            SET position = $1, organization = $2, start_date = $3, end_date = $4, description = $5, image_url = $6
            WHERE id = $7
            RETURNING *
            `,
            [position, organization, start_date, end_date || null, description, image_url || null, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Experience not found'
            });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Failed to update experience'
        });
    }
};

const deleteExperience = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `
            DELETE FROM experiences
            WHERE id = $1
            RETURNING *
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Experience not found'
            });
        }

        res.json({
            message: 'Experience deleted successfully'
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Failed to delete experience'
        });
    }
};

module.exports = {
    getAllExperiences,
    createExperience,
    updateExperience,
    deleteExperience,
};
