import express from 'express';
import { deleteWorkout, getWorkout, getWorkouts, postWorkout, putWorkout } from '../../controller/trainer/workoutController.js';
import { verifyClerkToken, requireAuth } from '../../middlewares/clerkAuthMiddleware.js';
import { apiLimiter } from '../../middlewares/rateLimitersMiddleware.js';

const router = express.Router({ mergeParams: true });

router.use(apiLimiter)
router.get('/', verifyClerkToken, requireAuth, getWorkouts)
router.get('/:workoutId', verifyClerkToken, requireAuth, getWorkout)
router.post('/', verifyClerkToken, requireAuth, postWorkout)
router.put('/:workoutId', verifyClerkToken, requireAuth, putWorkout)
router.delete('/:workoutId', verifyClerkToken, requireAuth, deleteWorkout)

export default router;