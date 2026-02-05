const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/auth');

// Registro y Login
router.post('/register', authController.register);
router.post('/login', authController.login);

// Ruta protegida (ejemplo)
router.get('/profile', authMiddleware.authenticate, authController.protectedRoute);

module.exports = router;