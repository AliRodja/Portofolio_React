const pool = require("../config/db");

const getAllCertificates = async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT *
      FROM certificates
      ORDER BY issue_date DESC
    `);

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch certificates",
        });

    }
};

module.exports = {
    getAllCertificates,
};