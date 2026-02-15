import express from 'express';
import { verifyClerkToken, requireAuth } from '../../middlewares/clerkAuthMiddleware.js';
import { apiLimiter } from '../../middlewares/rateLimitersMiddleware.js';
import { getSessions } from '../../controller/client/sessionsController.js';

const router = express.Router();

router.use(apiLimiter)
router.get("/", verifyClerkToken, requireAuth, getSessions)


export default router;