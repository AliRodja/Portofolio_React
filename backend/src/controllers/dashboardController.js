const pool = require("../config/db");

const getOverview = async (req, res) => {
    try {

        const [
            projects,
            skills,
            experiences,
            educations,
            certificates,
            messages
        ] = await Promise.all([

            pool.query("SELECT COUNT(*) FROM projects"),

            pool.query("SELECT COUNT(*) FROM skills"),

            pool.query("SELECT COUNT(*) FROM experiences"),

            pool.query("SELECT COUNT(*) FROM education"),

            pool.query("SELECT COUNT(*) FROM certificates"),

            pool.query("SELECT COUNT(*) FROM messages")

        ]);

        const latestMessages = await pool.query(`
            SELECT
                id,
                name,
                email,
                subject,
                message,
                created_at
            FROM messages
            ORDER BY created_at DESC
            LIMIT 5
        `);

        res.json({

            totalProjects: Number(projects.rows[0].count),

            totalSkills: Number(skills.rows[0].count),

            totalExperiences: Number(experiences.rows[0].count),

            totalEducations: Number(educations.rows[0].count),

            totalCertificates: Number(certificates.rows[0].count),

            totalMessages: Number(messages.rows[0].count),

            latestMessages: latestMessages.rows

        });

    } catch (err) {

        console.error(err);

        res.status(500).json({

            message: "Failed to fetch dashboard overview"

        });

    }
};

module.exports = {
    getOverview
};