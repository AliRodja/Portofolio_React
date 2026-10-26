const express = require("express");

const router = express.Router();

const { verifyToken, requireAdmin } = require("../middleware/authMiddleware");
const { validateBody } = require("../middleware/validate");
const schemas = require("../validators/schemas");

const {
    register,
    login,
} = require("../controllers/authController");

// Registration requires an existing logged-in ADMIN — this app has no
// public sign-up flow, only one (or a few) trusted admin accounts.
router.post("/register", verifyToken, requireAdmin, validateBody(schemas.register), register);

router.post("/login", validateBody(schemas.login), login);

module.exports = router;