const pool = require('../config/db');

const getSocialLinks = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT *
            FROM social_links
            ORDER BY id ASC
        `);

        res.json(result.rows);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Failed to fetch social links'
        });
    }
};

module.exports = {
    getSocialLinks
};