const pool = require('../config/db');

const getAllProjects = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT *
            FROM projects
            ORDER BY created_at DESC
        `);

        res.json(result.rows);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Failed to fetch projects'
        });
    }
};

module.exports = {
    getAllProjects
};