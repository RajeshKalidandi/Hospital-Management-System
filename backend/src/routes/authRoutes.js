const express = require('express');
const router = express.Router();
const { login, changePassword } = require('../controllers/authController');
const { adminMiddleware } = require('../middleware/auth');

// Public routes
router.post('/login', login);

// Protected routes
router.post('/change-password', adminMiddleware, changePassword);

module.exports = router; 