const express = require("express");

const router = express.Router();

const { verifyToken } = require("../middleware/authMiddleware");
const { messageLimiter } = require("../middleware/rateLimit");

const {
    getAllMessages,
    createMessage,
    deleteMessage,
} = require("../controllers/messageController");

router.get("/", verifyToken, getAllMessages);

// Only the public contact form is rate-limited; admin GET/DELETE are not.
router.post("/", messageLimiter, createMessage);

router.delete("/:id", verifyToken, deleteMessage);

module.exports = router;