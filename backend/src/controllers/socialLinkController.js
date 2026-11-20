const pool = require('../config/db');

const getSocialLinks = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT *
            FROM social_links
            ORDER BY order_index ASC, id ASC
        `);

        res.json(result.rows);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Failed to fetch social links'
        });
    }
};

const createSocialLink = async (req, res) => {
    try {
        const { platform, url, icon_name, order_index } = req.body;

        const result = await pool.query(
            `
            INSERT INTO social_links (platform, url, icon_name, order_index)
            VALUES ($1, $2, $3, $4)
            RETURNING *
            `,
            [platform, url, icon_name || null, order_index ?? 0]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Failed to create social link'
        });
    }
};

const updateSocialLink = async (req, res) => {
    try {
        const { id } = req.params;
        const { platform, url, icon_name, order_index } = req.body;

        const result = await pool.query(
            `
            UPDATE social_links
            SET platform = $1, url = $2, icon_name = $3, order_index = $4
            WHERE id = $5
            RETURNING *
            `,
            [platform, url, icon_name || null, order_index ?? 0, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Social link not found'
            });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Failed to update social link'
        });
    }
};

const deleteSocialLink = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `
            DELETE FROM social_links
            WHERE id = $1
            RETURNING *
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Social link not found'
            });
        }

        res.json({
            message: 'Social link deleted successfully'
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Failed to delete social link'
        });
    }
};

module.exports = {
    getSocialLinks,
    createSocialLink,
    updateSocialLink,
    deleteSocialLink,
};