const express = require("express");

const router = express.Router();

const { verifyToken, requireAdmin } = require("../middleware/authMiddleware");
const { validateBody, validateId } = require("../middleware/validate");
const schemas = require("../validators/schemas");

const {
    getAllProjects,
    createProject,
    updateProject,
    deleteProject,
} = require("../controllers/projectController");

router.get("/", getAllProjects);

router.post("/", verifyToken, requireAdmin, validateBody(schemas.project), createProject);

router.put("/:id", verifyToken, requireAdmin, validateId, validateBody(schemas.project), updateProject);

router.delete("/:id", verifyToken, requireAdmin, validateId, deleteProject);

module.exports = router;