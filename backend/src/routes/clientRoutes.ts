import express from 'express';
import { deleteClient, getClient, getClients, postClient, putClient } from '../controller/clientController.js';
import workoutRoutes from './workoutRoutes.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get("/", authenticateToken, getClients)
router.get("/:clientId", authenticateToken, getClient)
router.post("/", authenticateToken, postClient)
router.put("/:clientId", authenticateToken, putClient)
router.delete("/:clientId", authenticateToken, deleteClient)

// Nest workout routes under clients
router.use("/:clientId/workouts", workoutRoutes)

export default router;