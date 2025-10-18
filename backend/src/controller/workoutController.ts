import type { Request, Response } from "express";
import Client from "../models/Client";

export const getWorkouts = async (req: Request, res: Response) => {
    try {
        const client = await Client.findById(req.params.id)

        if (!client) {
            return res.status(404).json({ message: "Client not found" })
        }

        return res.status(200).json(client.workouts)
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : String(error) });
    }

}

export const getWorkout = async (req: Request<{ id: string; workoutId: string }>, res: Response) => {
    try {
        const client = await Client.findById(req.params.id)

        if (!client) {
            return res.status(404).json({ message: "Client not found" })
        }
        
        const workout = client.workouts.id(req.params.workoutId)
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
        const client = await Client.findById(req.params.id)

        if (!client) {
            return res.status(404).json({ message: "Client not found" })
        }
        
        client.workouts.push(req.body)
        await client.save()
        return res.status(201).json(client.workouts[client.workouts.length - 1])
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : String(error) });
    }
}

export const putWorkout = async (req: Request<{ id: string; workoutId: string }>, res: Response) => {
    try {
        const client = await Client.findById(req.params.id)
        if (!client) {
            return res.status(404).json({ message: "Client not found" })
        }
        
        const workout = client.workouts.id(req.params.workoutId)
        if (!workout) {
            return res.status(404).json({ message: "Workout not found" })
        }
        
        workout.set(req.body)
        await client.save()
        return res.status(200).json(workout)
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : String(error) });
    }
}

export const deleteWorkout = async (req: Request<{ id: string; workoutId: string }>, res: Response) => {
    try {
        const client = await Client.findById(req.params.id)
        
        if (!client) {
            return res.status(404).json({ message: "Client not found" })
        }
        
        const workout = client.workouts.id(req.params.workoutId)
        if (!workout) {
            return res.status(404).json({ message: "Workout not found" })
        }
        
        workout.deleteOne()
        await client.save()
        return res.status(200).json({ message: "Workout deleted" })
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : String(error) });
    }
}
