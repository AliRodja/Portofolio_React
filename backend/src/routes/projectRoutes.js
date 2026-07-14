const express = require("express");

const router = express.Router();

const { verifyToken } = require("../middleware/authMiddleware");

const {
    getAllProjects,
    createProject,
    updateProject,
    deleteProject,
} = require("../controllers/projectController");

router.get("/", getAllProjects);

router.post("/", verifyToken, createProject);

router.put("/:id", verifyToken, updateProject);

router.delete("/:id", verifyToken, deleteProject);

module.exports = router;