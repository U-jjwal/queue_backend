import express from 'express';
const router = express.Router();
import { getProfile, updateProfile, getAllServices } from '../controllers/userController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

router.get('/profile/:id', authMiddleware, getProfile);
router.put('/profile/:id', authMiddleware, updateProfile);

export default router;
