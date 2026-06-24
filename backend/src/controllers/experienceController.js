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

module.exports = {
    getAllExperiences
};