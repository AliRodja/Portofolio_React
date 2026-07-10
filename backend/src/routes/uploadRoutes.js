const express = require("express");
const router = express.Router();

const { upload } = require("../middleware/upload");
const { uploadImage } = require("../controllers/uploadController");

router.post("/", (req, res) => {
    upload.single("image")(req, res, (err) => {
        if (err) {
            return res.status(400).json({
                message: err.message || "Upload failed.",
            });
        }

        uploadImage(req, res);
    });
});

module.exports = router;
