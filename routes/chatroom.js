const express = require('express');
const router = express.Router();
const ChatroomController = require('../controllers/chatroom');

// Post
router.post('/', ChatroomController.Send);

module.exports = router;