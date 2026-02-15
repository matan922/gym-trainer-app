import express from 'express';
import { verifyClerkToken, requireAuth } from '../../middlewares/clerkAuthMiddleware.js';
import { apiLimiter } from '../../middlewares/rateLimitersMiddleware.js';
import { getWorkouts } from '../../controller/client/workoutController.js';


const router = express.Router();

router.use(apiLimiter)
router.get("/", verifyClerkToken, requireAuth, getWorkouts)


export default router;