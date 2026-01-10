const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser); // ✅ بعد ما نستدعيه فوق

module.exports = router;
