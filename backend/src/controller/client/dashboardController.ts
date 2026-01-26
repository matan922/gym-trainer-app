import type { Request, Response } from "express";
import User from "../../models/user/User.js";
import Workout from "../../models/Workout.js";
import TrainerClientRelation from "../../models/TrainerClientRelation.js";
import Session from "../../models/Session.js";

// for now get 1 trainer (in the future I'll add method for multiple trainers)
export const getDashboard = async (req: Request, res: Response) => {
    try {
        const user = req.user!

        const now = new Date()

        const relation = await TrainerClientRelation.findOne({ clientId: user.id })
        if (!relation) {
            return res.status(403).json({ message: 'Not authorized' })
        }

        const relatedTrainer = await User.findOne({ _id: relation.trainerId, 'profiles.trainer': { $exists: true } }, { password: 0 }) // find trainer without password
        if (!relatedTrainer) {
            return res.status(404).json({ message: 'Trainer not found' })
        }

        const upcomingSession = await Session.findOne({ clientId: user.id, startTime: { $gte: now } }).sort({ startTime: 1 })

        const lastSession = await Session.findOne({ clientId: user.id, startTime: { $lt: now } }).sort({ startTime: -1 })

        const dashboardData = {
            trainer: relatedTrainer ? {
                id: relatedTrainer._id,
                firstName: relatedTrainer.firstName,
                lastName: relatedTrainer.lastName
            } : null,
            nextSession: upcomingSession ? {
                id: upcomingSession._id,
                workoutId: upcomingSession.workoutId,
                workoutName: upcomingSession.workoutName,
                date: upcomingSession?.startTime,
                status: upcomingSession?.status

            } : null,
            previousSession: lastSession ? {
                id: lastSession._id,
                workoutId: lastSession.workoutId,
                workoutName: lastSession.workoutName,
                date: lastSession?.startTime,
                status: lastSession?.status,
            } : null
        }

        return res.status(200).json(dashboardData)
    } catch (error) {
        return res.status(500).json({
            message: error instanceof Error ? error.message : String(error)
        });
    }
}