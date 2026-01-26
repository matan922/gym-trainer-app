import express from 'express';
import { authenticateToken } from '../../middlewares/authMiddleware.js';
import { apiLimiter } from '../../middlewares/rateLimitersMiddleware.js';
import { getSessions } from '../../controller/client/sessionsController.js';

const router = express.Router();

router.use(apiLimiter)
router.get("/", authenticateToken, getSessions)


export default router;