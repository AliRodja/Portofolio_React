const express = require("express");

const router = express.Router();

const {
    getAllMessages,
    createMessage,
    deleteMessage,
} = require("../controllers/messageController");

router.get("/", getAllMessages);

router.post("/", createMessage);

router.delete("/:id", deleteMessage);

module.exports = router;