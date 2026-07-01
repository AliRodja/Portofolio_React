const express = require("express");

const router = express.Router();

const {
    getAllCertificates,
} = require("../controllers/certificateController");

router.get("/", getAllCertificates);

module.exports = router;