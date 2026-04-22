import express from 'express';
const router = express.Router();
import { registerUser, loginUser, registerAdmin, loginAdmin, logout, getMe } from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

router.post('/register-user', registerUser);
router.post('/login-user', loginUser);
router.post('/register-admin', registerAdmin);
router.post('/login-admin', loginAdmin);
router.get('/logout', logout);
router.get('/me', authMiddleware, getMe);

export default router;
