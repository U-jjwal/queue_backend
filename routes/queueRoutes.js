import express from 'express';
const router = express.Router();
import { getQueues, joinQueue, walkInQueue, callNext, updateStatus, checkIn, rejoinQueue } from '../controllers/queueController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

router.get('/', authMiddleware, getQueues);
router.post('/join', authMiddleware, joinQueue);
router.post('/walkin', authMiddleware, walkInQueue);
router.post('/call-next', authMiddleware, callNext);
router.post('/update-status', authMiddleware, updateStatus);
router.post('/checkin', authMiddleware, checkIn);
router.post('/rejoin', authMiddleware, rejoinQueue);

export default router;
