const pool = require("../config/db");

// ======================
// GET ALL PROJECTS
// ======================
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
            message: "Failed to fetch projects",
        });
    }
};

// ======================
// CREATE PROJECT
// ======================
const createProject = async (req, res) => {
    try {
        const {
            title,
            description,
            image_url,
            tech_stack,
            demo_link,
            repo_link,
            category,
            featured,
        } = req.body;

        const result = await pool.query(
            `
      INSERT INTO projects
      (
        title,
        description,
        image_url,
        tech_stack,
        demo_link,
        repo_link,
        category,
        featured
      )
      VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *
      `,
            [
                title,
                description,
                image_url,
                tech_stack,
                demo_link,
                repo_link,
                category,
                featured,
            ]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to create project",
        });
    }
};

// ======================
// UPDATE PROJECT
// ======================
const updateProject = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            title,
            description,
            image_url,
            tech_stack,
            demo_link,
            repo_link,
            category,
            featured,
        } = req.body;

        const result = await pool.query(
            `
      UPDATE projects
      SET
        title=$1,
        description=$2,
        image_url=$3,
        tech_stack=$4,
        demo_link=$5,
        repo_link=$6,
        category=$7,
        featured=$8,
        updated_at=NOW()
      WHERE id=$9
      RETURNING *
      `,
            [
                title,
                description,
                image_url,
                tech_stack,
                demo_link,
                repo_link,
                category,
                featured,
                id,
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Project not found",
            });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to update project",
        });
    }
};

// ======================
// DELETE PROJECT
// ======================
const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `
      DELETE FROM projects
      WHERE id=$1
      RETURNING *
      `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Project not found",
            });
        }

        res.json({
            message: "Project deleted successfully",
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to delete project",
        });
    }
};

module.exports = {
    getAllProjects,
    createProject,
    updateProject,
    deleteProject,
};