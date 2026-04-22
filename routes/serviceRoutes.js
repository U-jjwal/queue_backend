import express from 'express';
const router = express.Router();
import { getAllServices } from '../controllers/userController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

router.get('/', authMiddleware, getAllServices);

export default router;
