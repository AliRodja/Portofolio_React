const express = require("express");

const router = express.Router();

const {
    getAllCertificates,
    createCertificate,
    updateCertificate,
    deleteCertificate,
} = require("../controllers/certificateController");

router.get("/", getAllCertificates);
router.post("/", createCertificate);
router.put("/:id", updateCertificate);
router.delete("/:id", deleteCertificate);

module.exports = router;