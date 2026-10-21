const express = require("express");

const router = express.Router();

const { verifyToken } = require("../middleware/authMiddleware");
const { validateBody } = require("../middleware/validate");
const schemas = require("../validators/schemas");

const {

    getProfile,

    updateProfile,

} = require("../controllers/profileController");

router.get("/", getProfile);

router.put("/", verifyToken, validateBody(schemas.profile), updateProfile);

module.exports = router;