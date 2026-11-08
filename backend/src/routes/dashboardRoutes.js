const express = require("express");

const router = express.Router();

const { verifyToken, requireAdmin } = require("../middleware/authMiddleware");

const {
    getOverview
} = require("../controllers/dashboardController");

router.get("/overview", verifyToken, requireAdmin, getOverview);

module.exports = router;