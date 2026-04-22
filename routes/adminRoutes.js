import express from 'express';
const router = express.Router();
import { getProfile, updateProfile, getServices, createService, deleteService } from '../controllers/adminController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

router.get('/profile/:id', authMiddleware, getProfile);
router.put('/profile/:id', authMiddleware, updateProfile);
router.get('/services/:adminId', authMiddleware, getServices);
router.post('/services', authMiddleware, createService);
router.delete('/services/:id', authMiddleware, deleteService);

export default router;
