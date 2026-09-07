const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/authMiddleware");
const { upload } = require("../middleware/upload");
const { uploadFile } = require("../controllers/uploadController");

router.post("/", verifyToken, (req, res) => {
    upload.single("file")(req, res, (err) => {
        if (err) {
            return res.status(400).json({
                message: err.message || "Upload failed.",
            });
        }

        uploadFile(req, res);
    });
});

module.exports = router;
