import express from 'express';
import { verifyClerkToken, requireAuth } from '../../middlewares/clerkAuthMiddleware.js';
import { apiLimiter } from '../../middlewares/rateLimitersMiddleware.js';
import { getTrainerDashboard } from '../../controller/trainer/dashboardController.js';
const router = express.Router();

router.use(apiLimiter)
router.get("/dashboard", verifyClerkToken, requireAuth, getTrainerDashboard)


export default router;