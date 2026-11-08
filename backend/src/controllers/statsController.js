const pool = require("../config/db");

const getStats = async (req, res) => {
  try {

    // One round trip instead of four — matters on serverless cold starts.
    //
    // experience_years: whole years from the earliest project start
    // (projects.started_on) to today, rounded down so the site never claims
    // more than is true (owner's choice, 2026-11-08). Projects without a
    // start date, or starting in the future, are left out; with none, it is 0
    // and the site hides the figure.
    const result = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM projects) AS projects,
        (SELECT COUNT(*) FROM skills) AS skills,
        (SELECT COUNT(*) FROM experiences) AS experiences,
        (SELECT COUNT(*) FROM certificates) AS certificates,
        (
          SELECT COALESCE(EXTRACT(YEAR FROM age(CURRENT_DATE, MIN(started_on))), 0)
          FROM projects
          WHERE started_on <= CURRENT_DATE
        ) AS experience_years
    `);

    const counts = result.rows[0];

    res.json({

      projects: Number(counts.projects),

      skills: Number(counts.skills),

      experiences: Number(counts.experiences),

      certificates: Number(counts.certificates),

      experience_years: Number(counts.experience_years)

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
