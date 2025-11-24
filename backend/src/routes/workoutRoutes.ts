import express from 'express';
import { deleteWorkout, getWorkout, getWorkouts, postWorkout, putWorkout } from '../controller/workoutController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = express.Router({ mergeParams: true });

router.get('/', authenticateToken, getWorkouts)
router.get('/:workoutId', authenticateToken, getWorkout)
router.post('/', authenticateToken, postWorkout)
router.put('/:workoutId', authenticateToken, putWorkout)
router.delete('/:workoutId', authenticateToken, deleteWorkout)

export default router;