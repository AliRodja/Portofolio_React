const express = require("express");

const router = express.Router();

const { verifyToken } = require("../middleware/authMiddleware");

const {

    getProfile,

    updateProfile,

} = require("../controllers/profileController");

router.get("/", getProfile);

router.put("/", verifyToken, updateProfile);

module.exports = router;