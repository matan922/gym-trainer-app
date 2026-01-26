import express from 'express';
import { authenticateToken } from '../../middlewares/authMiddleware.js';
import { apiLimiter } from '../../middlewares/rateLimitersMiddleware.js';
import { getTrainerDashboard } from '../../controller/trainer/dashboardController.js';
const router = express.Router();

router.use(apiLimiter)
router.get("/dashboard", authenticateToken, getTrainerDashboard)


export default router;