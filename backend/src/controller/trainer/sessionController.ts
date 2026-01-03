import type { Request, Response } from "express";
import Session from "../../models/Session.js";
import TrainerClientRelation from "../../models/TrainerClientRelation.js";

export const getSessions = async (req: Request, res: Response) => {
    try {
        const user = req.user

        // Get ALL sessions for this trainer
        const sessions = await Session.find({ trainerId: user?.id })
            .populate({
                path: "clientId",
                select: "profiles.client"
            })

        res.status(200).json(sessions)
    } catch (error) {
        return res.status(500).json({ "error": error })
    }
}

export const postSession = async (req: Request, res: Response) => {
    try {
        const user = req.user
        const { clientId, startTime, sessionDate, endTime, sessionType, status } = req.body

        const relation = await TrainerClientRelation.findOne({ clientId: clientId, trainerId: user?.id, status: "active" })
        if (!relation) {
            return res.status(400).json({ message: "No relation between this client and you" })
        }

        const sessionStartTime = new Date(startTime)
        const sessionEndTime = endTime ? new Date(endTime) : new Date(sessionStartTime.getTime() + 60 * 60 * 1000)

        const session = new Session({
            trainerId: user?.id,
            clientId: clientId,
            sessionDate: new Date(sessionDate),
            startTime: new Date(startTime),
            endTime: sessionEndTime,
            sessionType: sessionType,
            status: status
        })

        await session.save()
        return res.status(200).json(session)

    } catch (error) {
        console.log(error)
        return res.status(500).json({ "error": error })
    }
}

export const updateSessionStatus = async (req: Request, res: Response) => {
    try {
        const user = req.user
        const { sessionId } = req.params
        const { status } = req.body

        // Find session and verify ownership
        const session = await Session.findOne({ _id: sessionId, trainerId: user?.id })

        if (!session) {
            return res.status(404).json({ success: false, message: "Session not found" })
        }

        const relation = await TrainerClientRelation.findOne({ clientId: session.clientId, trainerId: user?.id, status: "active" })
        if (!relation) {
            return res.status(403).json({ message: "Not authorized" })
        }

        // Update status
        session.status = status
        await session.save()

        return res.status(200).json({ success: true, session })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, error: error })
    }
}
