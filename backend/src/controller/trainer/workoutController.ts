import type { Request, Response } from "express";
import Workout from "../../models/Workout.js";
import User from "../../models/user/User.js";
import TrainerClientRelation from "../../models/TrainerClientRelation.js";

export const getWorkouts = async (req: Request, res: Response) => {
    try {
        const user = req.user
        const { clientId } = req.params;

        const relation = await TrainerClientRelation.findOne({ trainerId: user?.id, clientId: clientId, status: "active" })
        if (!relation) {
            return res.status(400).json({ message: "No relation between you and the client" })
        }

        const workouts = await Workout.find({ clientId: clientId, trainerId: user?.id, }) // in case of 0 workouts empty array is returned []
        return res.status(200).json(workouts)
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : String(error) });
    }

}

export const getWorkout = async (req: Request, res: Response) => {
    try {
        const user = req.user
        const { clientId, workoutId } = req.params;


        const relation = await TrainerClientRelation.findOne({ clientId: clientId, trainerId: user?.id, status: "active" })
        if (!relation) {
            return res.status(400).json({ message: "No relation between you and the client" })
        }

        const workout = await Workout.findOne({ _id: workoutId, clientId: clientId, trainerId: user?.id })
        if (!workout) {
            return res.status(404).json({ message: "Workout not found" })
        }

        return res.status(200).json(workout)
    } catch (error) {
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
            return res.status(400).json({ message: "No relation between you and the client" })
        }

        const newWorkout = await Workout.create({
            ...workoutData,
            clientId: clientId,
            trainerId: user?.id
        });

        return res.status(201).json(newWorkout)
    } catch (error) {
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
            return res.status(400).json({ message: "No relation between you and the client" })
        }

        const editWorkout = await Workout.findOneAndUpdate(
            { _id: workoutId, clientId: clientId, trainerId: user?.id },
            { ...workoutData },
            { new: true }
        )

        if (!editWorkout) {
            return res.status(404).json({ message: "Workout not found" });
        }

        return res.status(200).json(editWorkout)
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : String(error) });
    }
}

export const deleteWorkout = async (req: Request, res: Response) => {
    try {
        const user = req.user
        const { clientId, workoutId } = req.params;

        const relation = await TrainerClientRelation.findOne({ clientId: clientId, trainerId: user?.id, status: "active" })
        if (!relation) {
            return res.status(400).json({ message: "No relation between you and the client" })
        }

        const workout = await Workout.findOneAndDelete({
            _id: workoutId,
            clientId: clientId,
            trainerId: user?.id
        });

        if (!workout) {
            return res.status(404).json({ message: "Workout not found" });
        }

        return res.status(200).json({ message: "Workout deleted" })
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : String(error) });
    }
}
