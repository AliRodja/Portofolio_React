const express = require("express");

const router = express.Router();

const { verifyToken, requireAdmin } = require("../middleware/authMiddleware");
const { validateBody } = require("../middleware/validate");
const schemas = require("../validators/schemas");

const {

    getProfile,

    updateProfile,

} = require("../controllers/profileController");

router.get("/", getProfile);

router.put("/", verifyToken, requireAdmin, validateBody(schemas.profile), updateProfile);

module.exports = router;