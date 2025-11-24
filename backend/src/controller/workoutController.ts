import type { Request, Response } from "express";
import Client from "../models/Client";
import Workout from "../models/Workout";

export const getWorkouts = async (req: Request, res: Response) => {
    try {
        const user = req.user
        const { clientId } = req.params;

        const client = await Client.findOne({ _id: clientId, trainerId: user?.id });
        if (!client) {
            return res.status(404).json({ message: "Client not found" });
        }

        const workouts = await Workout.find({ clientId: clientId })
        return res.status(200).json(workouts)
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : String(error) });
    }

}

export const getWorkout = async (req: Request, res: Response) => {
    try {
        const user = req.user
        const { clientId, workoutId } = req.params;

        const client = await Client.findOne({ _id: clientId, trainerId: user?.id })
        if (!client) {
            return res.status(404).json({ message: "Client not found" })
        }


        const workout = await Workout.findOne({ _id: workoutId, clientId: clientId })

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
        console.log(workoutData)

        const client = await Client.findOne({ _id: clientId, trainerId: user?.id })
        if (!client) {
            return res.status(404).json({ message: "Client not found" })
        }

        const newWorkout = await Workout.create({
            ...workoutData,
            clientId: clientId
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

        console.log(workoutData, clientId, workoutId)

        const client = await Client.findOne({ _id: clientId, trainerId: user?.id })
        if (!client) {
            return res.status(404).json({ message: "Client not found" })
        }

        const editWorkout = await Workout.findOneAndUpdate(
            { _id: workoutId, clientId: clientId },
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

        const client = await Client.findOne({ _id: clientId, trainerId: user?.id })
        if (!client) {
            return res.status(404).json({ message: "Client not found" })
        }


        const workout = await Workout.findOneAndDelete({
            _id: workoutId,
            clientId: clientId
        });

        if (!workout) {
            return res.status(404).json({ message: "Workout not found" });
        }

        return res.status(200).json({ message: "Workout deleted" })
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : String(error) });
    }
}
