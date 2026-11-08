const pool = require("../config/db");

const getStats = async (req, res) => {
  try {

    // One round trip instead of four — matters on serverless cold starts.
    //
    // experience_years: whole years covered by the experiences, rounded down
    // so the site never claims more than is true. Overlapping roles count
    // once (range_agg merges them), a role without an end date runs until
    // today, and dates in the future are cut off at today.
    const result = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM projects) AS projects,
        (SELECT COUNT(*) FROM skills) AS skills,
        (SELECT COUNT(*) FROM experiences) AS experiences,
        (SELECT COUNT(*) FROM certificates) AS certificates,
        (
          SELECT COALESCE(FLOOR(SUM(upper(r) - lower(r)) / 365.25), 0)
          FROM unnest((
            SELECT range_agg(daterange(start_date, LEAST(COALESCE(end_date, CURRENT_DATE), CURRENT_DATE), '[]'))
            FROM experiences
            WHERE start_date <= LEAST(COALESCE(end_date, CURRENT_DATE), CURRENT_DATE)
          )) AS r
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
