import express from 'express';
import { verifyClerkToken, requireAuth } from '../../middlewares/clerkAuthMiddleware.js';
import { getSessions, postSession, updateSession, updateSessionStatus } from '../../controller/trainer/sessionController.js';
import { apiLimiter } from '../../middlewares/rateLimitersMiddleware.js';

const router = express.Router();

router.use(apiLimiter)
router.get("/", verifyClerkToken, requireAuth, getSessions)
router.get("/:clientId", verifyClerkToken, requireAuth, getSessions) // get sessions of specific client.
router.post("/", verifyClerkToken, requireAuth, postSession)
router.patch("/:sessionId", verifyClerkToken, requireAuth, updateSessionStatus)
router.put("/:sessionId", verifyClerkToken, requireAuth, updateSession)
router.delete("/:sessionId", verifyClerkToken, requireAuth,)


export default router;