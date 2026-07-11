const pool = require('../config/db');

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
        const { institution, degree, start_year, end_year, description } = req.body;

        const result = await pool.query(
            `
            INSERT INTO education (institution, degree, start_year, end_year, description)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
            `,
            [institution, degree, start_year, end_year || null, description]
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
        const { institution, degree, start_year, end_year, description } = req.body;

        const result = await pool.query(
            `
            UPDATE education
            SET institution = $1, degree = $2, start_year = $3, end_year = $4, description = $5
            WHERE id = $6
            RETURNING *
            `,
            [institution, degree, start_year, end_year || null, description, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Education not found'
            });
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
