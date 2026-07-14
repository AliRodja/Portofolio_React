const express = require("express");

const router = express.Router();

const { verifyToken } = require("../middleware/authMiddleware");

const {
    getAllMessages,
    createMessage,
    deleteMessage,
} = require("../controllers/messageController");

router.get("/", verifyToken, getAllMessages);

router.post("/", createMessage);

router.delete("/:id", verifyToken, deleteMessage);

module.exports = router;