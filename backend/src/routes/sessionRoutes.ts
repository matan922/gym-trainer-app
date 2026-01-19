import express from 'express';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { getSessions, postSession, updateSession, updateSessionStatus } from '../controller/trainer/sessionController.js';
import { apiLimiter } from '../middlewares/rateLimitersMiddleware.js';

const router = express.Router();

router.use(apiLimiter)
router.get("/", authenticateToken, getSessions)
router.get("/:clientId", authenticateToken, getSessions) // get sessions of specific client.
router.post("/", authenticateToken, postSession)
router.patch("/:sessionId", authenticateToken, updateSessionStatus)
router.put("/:sessionId", authenticateToken, updateSession)
router.delete("/:sessionId", authenticateToken, )


export default router;