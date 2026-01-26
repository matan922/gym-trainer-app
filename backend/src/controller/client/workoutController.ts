import type { Request, Response } from "express";
import { getWorkoutsForClient } from "../helper/workoutHelper.js";
import { AppError, NotFoundError } from "../../helper/errors.js";
import TrainerClientRelation from "../../models/TrainerClientRelation.js";


export const getWorkouts = async (req: Request, res: Response) => {
    try {
        const user = req.user?.id

        // Find the client's trainer (for now, get the first active relation)
        const relation = await TrainerClientRelation.findOne({ clientId: user, status: "active" })
        if (!relation) {
            throw new NotFoundError("No active trainer found")
        }

        const workouts = await getWorkoutsForClient(user!, relation.trainerId.toString())
        return res.status(200).json(workouts)
    } catch (error) {
        console.log(error)
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ message: error.message })
        }
        res.status(500).json({ message: error instanceof Error ? error.message : String(error) });
    }

}
