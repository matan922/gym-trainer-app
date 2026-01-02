import express from 'express';
import { endRelation, getClient, getClients } from '../controller/clientController.js';
import workoutRoutes from './workoutRoutes.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { apiLimiter } from '../middlewares/rateLimitersMiddleware.js';
const router = express.Router();

router.use(apiLimiter)
router.get("/", authenticateToken, getClients)
router.get("/:clientId", authenticateToken, getClient)
router.delete("/:clientId", authenticateToken, endRelation)

// Nest workout routes under clients
router.use("/:clientId/workouts", workoutRoutes)

export default router;