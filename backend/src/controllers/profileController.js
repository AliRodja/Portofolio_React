const pool = require("../config/db");

// GET PROFILE
const getProfile = async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT *
      FROM profile
      LIMIT 1
    `);

        res.json(result.rows[0]);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Failed to fetch profile",
        });

    }
};

// UPDATE PROFILE
const updateProfile = async (req, res) => {

    try {

        const {

            full_name,
            headline,
            about,
            email,
            phone,
            location,
            github_url,
            linkedin_url,
            instagram_url,
            profile_image,
            resume_url,

        } = req.body;

        const result = await pool.query(
            `
      UPDATE profile
      SET

      full_name=$1,
      headline=$2,
      about=$3,
      email=$4,
      phone=$5,
      location=$6,
      github_url=$7,
      linkedin_url=$8,
      instagram_url=$9,
      profile_image=$10,
      resume_url=$11,
      updated_at=NOW()

      WHERE id=1

      RETURNING *

      `,
            [
                full_name,
                headline,
                about,
                email,
                phone,
                location,
                github_url,
                linkedin_url,
                instagram_url,
                profile_image,
                resume_url,
            ]
        );

        res.json(result.rows[0]);

    } catch (err) {

        console.error(err);

        res.status(500).json({

            message: "Failed to update profile",

        });

    }

};

module.exports = {

    getProfile,

    updateProfile,

};