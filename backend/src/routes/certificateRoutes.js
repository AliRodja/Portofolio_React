const express = require("express");

const router = express.Router();

const { verifyToken } = require("../middleware/authMiddleware");

const {
    getAllCertificates,
    createCertificate,
    updateCertificate,
    deleteCertificate,
} = require("../controllers/certificateController");

router.get("/", getAllCertificates);
router.post("/", verifyToken, createCertificate);
router.put("/:id", verifyToken, updateCertificate);
router.delete("/:id", verifyToken, deleteCertificate);

module.exports = router;