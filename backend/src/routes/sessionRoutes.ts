import express from 'express';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { getSessions, postSession, updateSessionStatus } from '../controller/trainer/sessionController.js';
import { apiLimiter } from '../middlewares/rateLimitersMiddleware.js';

const router = express.Router();

router.use(apiLimiter)
router.get("/", authenticateToken, getSessions)
router.get("/:sessionId", authenticateToken, )
router.post("/", authenticateToken, postSession)
router.patch("/:sessionId", authenticateToken, updateSessionStatus)
router.put("/:sessionId", authenticateToken, )
router.delete("/:sessionId", authenticateToken, )


export default router;