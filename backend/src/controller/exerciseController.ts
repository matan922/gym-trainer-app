import type { Request, Response } from "express";
import Client from "../models/Client";

// get all of the exercises for a client
export const getExercises = async (req: Request<{ id: string, workoutId: string }>, res: Response) => {
    try {
        const client = await Client.findById(req.params.id)

        if (!client) {
            return res.status(404).json({ message: "Client not found" })
        }

        const workout = client.workouts.id(req.params.workoutId)
        if (!workout) {
            return res.status(404).json({ message: "Workout not found" })
        }

        return res.status(200).json(workout.exercises) // returns all exercises for a specific client
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : String(error) });
    }
}

export const getExercise = async (req: Request<{ id: string, workoutId: string, exerciseId: string }>, res: Response) => {
    try {
        const client = await Client.findById(req.params.id)

        if (!client) {
            return res.status(404).json({ message: "Client not found" })
        }

        const workout = client.workouts.id(req.params.workoutId)
        if (!workout) {
            return res.status(404).json({ message: "Workout not found" })
        }

        const exercise = workout.exercises.id(req.params.exerciseId)
        if (!exercise) {
            return res.status(404).json({ message: "Exercise not found" })
        }

        return res.status(200).json(exercise)
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : String(error) });
    }
}

export const postExercise = async (req: Request<{ id: string, workoutId: string }>, res: Response) => {
    try {
        const client = await Client.findById(req.params.id)

        if (!client) {
            return res.status(404).json({ message: "Client not found" })
        }

        const workout = client.workouts.id(req.params.workoutId)
        if (!workout) {
            return res.status(404).json({ message: "Workout not found" })
        }

        workout.exercises.push(req.body)
        await client.save()
        return res.status(201).json(workout.exercises[workout.exercises.length - 1])
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : String(error) });
    }

}

export const putExercise = async (req: Request<{ id: string, workoutId: string, exerciseId: string }>, res: Response) => {
    try {
        const client = await Client.findById(req.params.id)

        if (!client) {
            return res.status(404).json({ message: "Client not found" })
        }

        const workout = client.workouts.id(req.params.workoutId)
        if (!workout) {
            return res.status(404).json({ message: "Workout not found" })
        }

        const exercise = workout.exercises.id(req.params.exerciseId)
        if (!exercise) {
            return res.status(404).json({ message: "Exercise not found" })
        }

        exercise.set(req.body)
        await client.save()
        return res.status(200).json(exercise)
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : String(error) });
    }

}


export const deleteExercise = async (req: Request<{ id: string, workoutId: string, exerciseId: string }>, res: Response) => {
    try {
        const client = await Client.findById(req.params.id)

        if (!client) {
            return res.status(404).json({ message: "Client not found" })
        }

        const workout = client.workouts.id(req.params.workoutId)
        if (!workout) {
            return res.status(404).json({ message: "Workout not found" })
        }

        const exercise = workout.exercises.id(req.params.exerciseId)
        if (!exercise) {
            return res.status(404).json({ message: "Exercise not found" })
        }
        exercise.deleteOne()
        await client.save()
        return res.status(200).json({message: "Deleted Exercise"})
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : String(error) });
    }

}