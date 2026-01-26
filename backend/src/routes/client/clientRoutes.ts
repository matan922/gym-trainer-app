import express from 'express';
import { authenticateToken } from '../../middlewares/authMiddleware.js';
import { apiLimiter } from '../../middlewares/rateLimitersMiddleware.js';
import { getDashboard } from '../../controller/client/dashboardController.js';


const router = express.Router();

router.use(apiLimiter)
router.get("/dashboard", authenticateToken, getDashboard)


export default router;