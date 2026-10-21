const express = require("express");

const router = express.Router();

const { verifyToken } = require("../middleware/authMiddleware");
const { validateBody, validateId } = require("../middleware/validate");
const schemas = require("../validators/schemas");

const {
    getAllCertificates,
    createCertificate,
    updateCertificate,
    deleteCertificate,
} = require("../controllers/certificateController");

router.get("/", getAllCertificates);
router.post("/", verifyToken, validateBody(schemas.certificate), createCertificate);
router.put("/:id", verifyToken, validateId, validateBody(schemas.certificate), updateCertificate);
router.delete("/:id", verifyToken, validateId, deleteCertificate);

module.exports = router;