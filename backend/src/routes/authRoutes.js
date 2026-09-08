const express = require("express");

const router = express.Router();

const { verifyToken, requireAdmin } = require("../middleware/authMiddleware");

const {
    register,
    login,
} = require("../controllers/authController");

// Registration requires an existing logged-in ADMIN — this app has no
// public sign-up flow, only one (or a few) trusted admin accounts.
router.post("/register", verifyToken, requireAdmin, register);

router.post("/login", login);

module.exports = router;