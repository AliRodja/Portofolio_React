const pool = require("../config/db");

const getOverview = async (req, res) => {
    try {

        // All six counts in one query, run alongside the latest-messages query,
        // so the overview needs two connections instead of seven.
        const [counts, latestMessages] = await Promise.all([

            pool.query(`
                SELECT
                    (SELECT COUNT(*) FROM projects) AS projects,
                    (SELECT COUNT(*) FROM skills) AS skills,
                    (SELECT COUNT(*) FROM experiences) AS experiences,
                    (SELECT COUNT(*) FROM education) AS educations,
                    (SELECT COUNT(*) FROM certificates) AS certificates,
                    (SELECT COUNT(*) FROM messages) AS messages
            `),

            pool.query(`
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
            `)

        ]);

        const total = counts.rows[0];

        res.json({

            totalProjects: Number(total.projects),

            totalSkills: Number(total.skills),

            totalExperiences: Number(total.experiences),

            totalEducations: Number(total.educations),

            totalCertificates: Number(total.certificates),

            totalMessages: Number(total.messages),

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