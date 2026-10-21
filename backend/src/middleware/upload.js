const path = require("path");
const multer = require("multer");

// Exact MIME type -> extensions allowed for it. Matching exactly (not a regex
// "contains png" test) stops tricks like "text/html; x=png", which would let
// someone host an HTML page in the public bucket. SVG is deliberately absent:
// it can carry scripts.
const ALLOWED_TYPES = {
    "image/jpeg": [".jpg", ".jpeg"],
    "image/png": [".png"],
    "image/webp": [".webp"],
    "image/gif": [".gif"],
    "application/pdf": [".pdf"],
};

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExts = ALLOWED_TYPES[file.mimetype];

    if (allowedExts && allowedExts.includes(ext)) {
        return cb(null, true);
    }

    cb(new Error("Only image files (jpeg, jpg, png, webp, gif) or PDF files are allowed."));
};

const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter,
    // Vercel serverless functions cap the request body at ~4.5 MB, so keep the
    // upload limit below that.
    limits: { fileSize: 4 * 1024 * 1024, files: 1 },
});

module.exports = { upload, ALLOWED_TYPES };
