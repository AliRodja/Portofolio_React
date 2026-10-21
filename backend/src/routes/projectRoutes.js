const express = require("express");

const router = express.Router();

const { verifyToken } = require("../middleware/authMiddleware");
const { validateBody, validateId } = require("../middleware/validate");
const schemas = require("../validators/schemas");

const {
    getAllProjects,
    createProject,
    updateProject,
    deleteProject,
} = require("../controllers/projectController");

router.get("/", getAllProjects);

router.post("/", verifyToken, validateBody(schemas.project), createProject);

router.put("/:id", verifyToken, validateId, validateBody(schemas.project), updateProject);

router.delete("/:id", verifyToken, validateId, deleteProject);

module.exports = router;