import express from 'express';
import { authenticateToken } from '../../middlewares/authMiddleware.js';
import { apiLimiter } from '../../middlewares/rateLimitersMiddleware.js';
import { getWorkouts } from '../../controller/client/workoutController.js';


const router = express.Router();

router.use(apiLimiter)
router.get("/", authenticateToken, getWorkouts)


export default router;