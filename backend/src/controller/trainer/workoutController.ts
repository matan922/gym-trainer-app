import type { Request, Response } from "express";
import Workout from "../../models/Workout.js";
import TrainerClientRelation from "../../models/TrainerClientRelation.js";
import { getWorkoutsForTrainer } from "../helper/workoutHelper.js";
import { AppError, ForbiddenError, NotFoundError } from "../../helper/errors.js";

export const getWorkouts = async (req: Request, res: Response) => {
    try {
        const user = req.user?.id
        const { clientId } = req.params;

        const workouts = await getWorkoutsForTrainer(user!, clientId!)
        return res.status(200).json(workouts)
    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ message: error.message })
        }
        res.status(500).json({ message: error instanceof Error ? error.message : String(error) });
    }

}

export const getWorkout = async (req: Request, res: Response) => {
    try {
        const user = req.user
        const { clientId, workoutId } = req.params;


        const relation = await TrainerClientRelation.findOne({ clientId: clientId, trainerId: user?.id, status: "active" })
        if (!relation) {
            throw new ForbiddenError("No relation between you and the client")
        }

        const workout = await Workout.findOne({ _id: workoutId, clientId: clientId, trainerId: user?.id })
        if (!workout) {
            throw new NotFoundError("Workout not found")
        }

        return res.status(200).json(workout)
    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ message: error.message })
        }
        res.status(500).json({ message: error instanceof Error ? error.message : String(error) });
    }
}

export const postWorkout = async (req: Request, res: Response) => {
    try {
        const user = req.user
        const { clientId } = req.params;
        const workoutData = req.body;

        const relation = await TrainerClientRelation.findOne({ clientId: clientId, trainerId: user?.id, status: "active" })
        if (!relation) {
            throw new ForbiddenError("No relation between you and the client")
        }

        const newWorkout = await Workout.create({
            ...workoutData,
            clientId: clientId,
            trainerId: user?.id
        });

        return res.status(201).json(newWorkout)
    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ message: error.message })
        }
        res.status(500).json({ message: error instanceof Error ? error.message : String(error) });
    }
}

export const putWorkout = async (req: Request, res: Response) => {
    try {
        const user = req.user
        const { clientId, workoutId } = req.params;
        const workoutData = req.body;

        const relation = await TrainerClientRelation.findOne({ clientId: clientId, trainerId: user?.id, status: "active" })
        if (!relation) {
            throw new ForbiddenError("No relation between you and the client")
        }

        const editWorkout = await Workout.findOneAndUpdate(
            { _id: workoutId, clientId: clientId, trainerId: user?.id },
            { ...workoutData },
            { new: true }
        )

        if (!editWorkout) {
            throw new NotFoundError("Workout not found")
        }

        return res.status(200).json(editWorkout)
    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ message: error.message })
        }
        res.status(500).json({ message: error instanceof Error ? error.message : String(error) });
    }
}

export const deleteWorkout = async (req: Request, res: Response) => {
    try {
        const user = req.user
        const { clientId, workoutId } = req.params;

        const relation = await TrainerClientRelation.findOne({ clientId: clientId, trainerId: user?.id, status: "active" })
        if (!relation) {
            throw new ForbiddenError("No relation between you and the client")
        }

        const workout = await Workout.findOneAndDelete({
            _id: workoutId,
            clientId: clientId,
            trainerId: user?.id
        });

        if (!workout) {
            throw new NotFoundError("Workout not found")
        }

        return res.status(200).json({ message: "Workout deleted" })
    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ message: error.message })
        }
        res.status(500).json({ message: error instanceof Error ? error.message : String(error) });
    }
}
