const pool = require("../config/db");

const getStats = async (req, res) => {
  try {

    // One round trip instead of four — matters on serverless cold starts.
    const result = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM projects) AS projects,
        (SELECT COUNT(*) FROM skills) AS skills,
        (SELECT COUNT(*) FROM experiences) AS experiences,
        (SELECT COUNT(*) FROM certificates) AS certificates
    `);

    const counts = result.rows[0];

    res.json({

      projects: Number(counts.projects),

      skills: Number(counts.skills),

      experiences: Number(counts.experiences),

      certificates: Number(counts.certificates)

    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Failed to fetch stats"
    });

  }
};

module.exports = {
  getStats,
};
