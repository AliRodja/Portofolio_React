const path = require("path");
const multer = require("multer");

const allowedTypes = /jpeg|jpg|png|webp|gif|pdf/;

const fileFilter = (req, file, cb) => {
    const isValidExt = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const isValidMime = allowedTypes.test(file.mimetype);

    if (isValidExt && isValidMime) {
        return cb(null, true);
    }

    cb(new Error("Only image files (jpeg, jpg, png, webp, gif) or PDF files are allowed."));
};

const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter,
    // Vercel serverless functions cap the request body at ~4.5 MB, so keep the
    // upload limit below that.
    limits: { fileSize: 4 * 1024 * 1024 },
});

module.exports = { upload };