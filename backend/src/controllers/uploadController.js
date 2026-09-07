const path = require("path");

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;
const BUCKET = process.env.SUPABASE_BUCKET || "uploads";

const uploadFile = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            message: "No file provided.",
        });
    }

    try {
        const ext = path.extname(req.file.originalname).toLowerCase();
        const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;

        // PDF disimpan di folder "docs/", file lain (gambar) di "images/".
        const folder = req.file.mimetype === "application/pdf" ? "docs" : "images";
        const objectPath = `${folder}/${filename}`;

        // Upload ke Supabase Storage lewat REST API
        const uploadRes = await fetch(
            `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${objectPath}`,
            {
                method: "POST",
                headers: {
                    apikey: SUPABASE_SECRET_KEY,
                    Authorization: `Bearer ${SUPABASE_SECRET_KEY}`,
                    "Content-Type": req.file.mimetype,
                },
                body: req.file.buffer,
            }
        );

        if (!uploadRes.ok) {
            const detail = await uploadRes.text();
            console.error("Supabase upload failed:", uploadRes.status, detail);
            return res.status(500).json({
                message: "Failed to upload to storage.",
            });
        }

        // Public URL (karena bucket-nya public)
        const url = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${objectPath}`;

        res.status(201).json({ url });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Upload failed.",
        });
    }
};

module.exports = {
    uploadFile,
};
