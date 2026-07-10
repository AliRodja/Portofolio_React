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

module.exports = {
    getEducation
};