const pool = require('../config/db');
const { deleteFile } = require('../utils/storage');

const getEducation = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT *
            FROM education
            ORDER BY id ASC
        `);

        res.json(result.rows);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Failed to fetch education'
        });
    }
};

const createEducation = async (req, res) => {
    try {
        const { institution, degree, start_year, end_year, description, activity_images } = req.body;

        const result = await pool.query(
            `
            INSERT INTO education (institution, degree, start_year, end_year, description, activity_images)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
            `,
            [institution, degree, start_year, end_year || null, description, activity_images || []]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Failed to create education'
        });
    }
};

const updateEducation = async (req, res) => {
    try {
        const { id } = req.params;
        const { institution, degree, start_year, end_year, description, activity_images } = req.body;

        const existing = await pool.query(
            'SELECT activity_images FROM education WHERE id = $1',
            [id]
        );

        const nextActivities = activity_images || [];

        const result = await pool.query(
            `
            UPDATE education
            SET institution = $1, degree = $2, start_year = $3, end_year = $4, description = $5, activity_images = $6
            WHERE id = $7
            RETURNING *
            `,
            [institution, degree, start_year, end_year || null, description, nextActivities, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Education not found'
            });
        }

        const oldActivities = Array.isArray(existing.rows[0]?.activity_images) ? existing.rows[0].activity_images : [];
        const nextSet = new Set(nextActivities);
        for (const oldUrl of oldActivities) {
            if (!nextSet.has(oldUrl)) {
                await deleteFile(oldUrl);
            }
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Failed to update education'
        });
    }
};

const deleteEducation = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `
            DELETE FROM education
            WHERE id = $1
            RETURNING *
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Education not found'
            });
        }

        const oldActivities = Array.isArray(result.rows[0]?.activity_images) ? result.rows[0].activity_images : [];
        for (const url of oldActivities) {
            await deleteFile(url);
        }

        res.json({
            message: 'Education deleted successfully'
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Failed to delete education'
        });
    }
};

module.exports = {
    getEducation,
    createEducation,
    updateEducation,
    deleteEducation,
};
