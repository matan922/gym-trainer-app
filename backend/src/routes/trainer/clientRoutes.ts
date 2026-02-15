import express from 'express';
import { endRelation, getClient, getClients } from '../../controller/trainer/clientController.js';
import workoutRoutes from './workoutRoutes.js';
import { verifyClerkToken, requireAuth } from '../../middlewares/clerkAuthMiddleware.js';
import { apiLimiter } from '../../middlewares/rateLimitersMiddleware.js';
const router = express.Router();

router.use(apiLimiter)
router.get("/", verifyClerkToken, requireAuth, getClients)
router.get("/:clientId", verifyClerkToken, requireAuth, getClient)
router.delete("/", verifyClerkToken, requireAuth, endRelation)

// Nest workout routes under clients
router.use("/:clientId/workouts", workoutRoutes)

export default router;