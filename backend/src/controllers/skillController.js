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

const createSkill = async (req, res) => {
    try {
        const { name, category, icon_name, order_index } = req.body;

        const result = await pool.query(
            `
            INSERT INTO skills (name, category, icon_name, order_index)
            VALUES ($1, $2, $3, $4)
            RETURNING *
            `,
            [name, category, icon_name, order_index || 0]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Failed to create skill'
        });
    }
};

const updateSkill = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, category, icon_name, order_index } = req.body;

        const result = await pool.query(
            `
            UPDATE skills
            SET name = $1, category = $2, icon_name = $3, order_index = $4
            WHERE id = $5
            RETURNING *
            `,
            [name, category, icon_name, order_index || 0, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Skill not found'
            });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Failed to update skill'
        });
    }
};

const deleteSkill = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `
            DELETE FROM skills
            WHERE id = $1
            RETURNING *
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Skill not found'
            });
        }

        res.json({
            message: 'Skill deleted successfully'
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Failed to delete skill'
        });
    }
};

module.exports = {
    getAllSkills,
    createSkill,
    updateSkill,
    deleteSkill,
};
