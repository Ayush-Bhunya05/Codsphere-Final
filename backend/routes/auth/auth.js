import express from 'express';
import AuthController from '../../controllers/auth/auth.js';
import { authMiddleware, checkPasswordChange } from '../../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/login', AuthController.login);

// Protected routes
router.get('/profile', authMiddleware, checkPasswordChange, AuthController.getProfile);
router.post('/change-password', authMiddleware, AuthController.changePassword);

export default router;