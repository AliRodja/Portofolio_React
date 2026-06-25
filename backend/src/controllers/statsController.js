const pool = require("../config/db");

const getStats = async (req, res) => {
  try {

    const projects = await pool.query(
      "SELECT COUNT(*) FROM projects"
    );

    const skills = await pool.query(
      "SELECT COUNT(*) FROM skills"
    );

    const experiences = await pool.query(
      "SELECT COUNT(*) FROM experiences"
    );

    const certificates = await pool.query(
      "SELECT COUNT(*) FROM certificates"
    );

    res.json({

      projects: Number(projects.rows[0].count),

      skills: Number(skills.rows[0].count),

      experiences: Number(experiences.rows[0].count),

      certificates: Number(certificates.rows[0].count)

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