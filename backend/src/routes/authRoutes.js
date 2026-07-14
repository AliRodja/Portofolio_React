const express = require("express");

const router = express.Router();

const { verifyToken } = require("../middleware/authMiddleware");

const {
    register,
    login,
} = require("../controllers/authController");

// Registration requires an existing logged-in admin — this app has no
// public sign-up flow, only one (or a few) trusted admin accounts.
router.post("/register", verifyToken, register);

router.post("/login", login);

module.exports = router;