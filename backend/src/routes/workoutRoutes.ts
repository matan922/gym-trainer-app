import express from 'express';
import { deleteWorkout, getWorkout, getWorkouts, postWorkout, putWorkout } from '../controller/trainer/workoutController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { apiLimiter } from '../middlewares/rateLimitersMiddleware.js';

const router = express.Router({ mergeParams: true });

router.use(apiLimiter)
router.get('/', authenticateToken, getWorkouts)
router.get('/:workoutId', authenticateToken, getWorkout)
router.post('/', authenticateToken, postWorkout)
router.put('/:workoutId', authenticateToken, putWorkout)
router.delete('/:workoutId', authenticateToken, deleteWorkout)

export default router;