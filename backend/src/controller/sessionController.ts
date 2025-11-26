import type { Request, Response } from "express";
import Session from "../models/Session";



export const getSessions = async (req: Request, res: Response) => {
    try {
        const user = req.user
        if (user) {
            const sessions = await Session.find({ trainerId: user.id })

            res.status(200).json(sessions)
        }
    } catch (error) {
        return res.status(500).json({ "error": error })
    }
}

export const postSession = async (req: Request, res: Response) => {
    try {
        const user = req.user
        const { clientId, startTime, endTime, sessionType, status } = req.body

        const sessionStartTime = new Date(startTime)
        const sessionEndTime = endTime ? new Date(endTime) : new Date(sessionStartTime.getTime() + 60 * 60 * 1000)

        if (user) {
            const session = new Session({
                trainerId: user.id,
                clientId: clientId,
                startTime: new Date(startTime),
                endTime: sessionEndTime,
                sessionType: sessionType,
                status: status
            })

            await session.save()
            return res.status(200).json(session)
        }
    } catch (error) {
        return res.status(500).json({ "error": error })
    }
}
