import express from 'express';
import { deleteClient, getClient, getClients, postClient, putClient } from '../controller/clientController';
import workoutRoutes from './workoutRoutes';

const router = express.Router();

router.get("/", getClients)
router.get("/:id", getClient)
router.post("/", postClient)
router.put("/:id", putClient)
router.delete("/:id", deleteClient)

router.use("/:id/workouts", workoutRoutes);


export default router;