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

const createCertificate = async (req, res) => {
    try {
        const { title, issuer, image_url, issue_date, credential_url } = req.body;

        const result = await pool.query(
            `
            INSERT INTO certificates (title, issuer, image_url, issue_date, credential_url)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
            `,
            [title, issuer, image_url || null, issue_date, credential_url || null]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to create certificate",
        });
    }
};

const updateCertificate = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, issuer, image_url, issue_date, credential_url } = req.body;

        const result = await pool.query(
            `
            UPDATE certificates
            SET title = $1, issuer = $2, image_url = $3, issue_date = $4, credential_url = $5
            WHERE id = $6
            RETURNING *
            `,
            [title, issuer, image_url || null, issue_date, credential_url || null, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Certificate not found",
            });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to update certificate",
        });
    }
};

const deleteCertificate = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `
            DELETE FROM certificates
            WHERE id = $1
            RETURNING *
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Certificate not found",
            });
        }

        res.json({
            message: "Certificate deleted successfully",
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to delete certificate",
        });
    }
};

module.exports = {
    getAllCertificates,
    createCertificate,
    updateCertificate,
    deleteCertificate,
};
