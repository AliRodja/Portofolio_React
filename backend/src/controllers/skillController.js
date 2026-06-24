const pool = require('../config/db');

const getAllSkills = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT *
            FROM skills
            ORDER BY order_index ASC
        `);

        res.json(result.rows);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Failed to fetch skills'
        });
    }
};

module.exports = {
    getAllSkills
};