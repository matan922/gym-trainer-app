import express from 'express';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { getSessions, postSession } from '../controller/sessionController.js';

const router = express.Router();

router.get("/", authenticateToken, getSessions)
router.get("/:sessionId", authenticateToken, )
router.post("/", authenticateToken, postSession)
router.put("/:sessionId", authenticateToken, )
router.delete("/:sessionId", authenticateToken, )


export default router;