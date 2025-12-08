import express from 'express';
import { deleteWorkout, getWorkout, getWorkouts, postWorkout, putWorkout } from '../controller/workoutController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router({ mergeParams: true });

router.get('/', authenticateToken, getWorkouts)
router.get('/:workoutId', authenticateToken, getWorkout)
router.post('/', authenticateToken, postWorkout)
router.put('/:workoutId', authenticateToken, putWorkout)
router.delete('/:workoutId', authenticateToken, deleteWorkout)

export default router;