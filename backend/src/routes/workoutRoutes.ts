import express from 'express';
import { deleteWorkout, getWorkout, getWorkouts, postWorkout, putWorkout } from '../controller/workoutController';
import exerciseRoutes from './exerciseRoutes';

const router = express.Router({ mergeParams: true });

router.get('/', getWorkouts)
router.get('/:workoutId', getWorkout)
router.post('/', postWorkout)
router.put('/:workoutId', putWorkout)
router.delete('/:workoutId', deleteWorkout)

router.use("/:workoutId/exercises", exerciseRoutes);

export default router;