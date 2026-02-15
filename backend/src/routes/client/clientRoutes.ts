import express from 'express';
import { verifyClerkToken, requireAuth } from '../../middlewares/clerkAuthMiddleware.js';
import { apiLimiter } from '../../middlewares/rateLimitersMiddleware.js';
import { getDashboard } from '../../controller/client/dashboardController.js';


const router = express.Router();

router.use(apiLimiter)
router.get("/dashboard", verifyClerkToken, requireAuth, getDashboard)


export default router;