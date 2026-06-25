const pool = require('../config/db');

const getProfile = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM profile LIMIT 1'
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Failed to fetch profile'
        });
    }
};

module.exports = {
    getProfile
};