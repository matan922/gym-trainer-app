import type { Request, Response } from "express";
import Session from "../../models/Session.js";
import TrainerClientRelation from "../../models/TrainerClientRelation.js";

export const getSessions = async (req: Request, res: Response) => {
    try {
        const user = req.user
        const { filter } = req.query
        const { clientId } = req.params // This will be undefined if not in the route

        const now = new Date()
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        let query: any = { trainerId: user?.id }
        
        // Add clientId filter if provided
        if (clientId) {
            query.clientId = clientId
        }

        // Apply time/status filters
        if (!filter) {
            
        }
        else if (filter === 'overdue') {
            query.status = 'Scheduled'
            query.startTime = { $lt: now }
        }
        else if (filter === 'upcoming') {
            query.status = 'Scheduled'
            query.startTime = { $gte: now }
        }
        else if (filter === 'completed') {
            query.status = 'Completed'
        }
        else if (filter === 'cancelled') {
            query.status = 'Cancelled'
        }
        const sessions = await Session.find(query)
        .populate({ path: "clientId" })
        .populate({ path: "workoutId" })
        .sort({ startTime: 1 })
        console.log(sessions)
        res.status(200).json(sessions)
    } catch (error) {
        return res.status(500).json({ error })
    }
}

export const postSession = async (req: Request, res: Response) => {
    try {
        const user = req.user
        const { clientId, startTime, endTime, sessionType, status, workoutName, workoutId } = req.body

        const relation = await TrainerClientRelation.findOne({ clientId: clientId, trainerId: user?.id, status: "active" })
        if (!relation) {
            return res.status(400).json({ message: "No relation between this client and you" })
        }

        const sessionStartTime = new Date(startTime)
        const sessionEndTime = endTime ? new Date(endTime) : new Date(sessionStartTime.getTime() + 60 * 60 * 1000)

        const session = new Session({
            trainerId: user?.id,
            clientId: clientId,
            startTime: new Date(startTime),
            endTime: sessionEndTime,
            sessionType: sessionType,
            status: status,
            workoutId: workoutId,
            workoutName: workoutName
        })

        await session.save()
        return res.status(200).json(session)

    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error })
    }
}

export const updateSession = async (req: Request, res: Response) => {
    try {
        const user = req.user
        const { sessionId } = req.params
        const { clientId, startTime, endTime, sessionType, status, workoutName, workoutId } = req.body
        const relation = await TrainerClientRelation.findOne({ clientId: clientId, trainerId: user?.id, status: 'active' })
        if (!relation) {
            return res.status(400).json({ message: "No relation between this client and you" })
        }

        const session = await Session.findById(sessionId)
        if (!session) {
            return res.status(400).json({ message: "Session dont exist" })
        }

        session.startTime = startTime || session.startTime
        session.endTime = endTime || session.endTime
        session.sessionType = sessionType || session.sessionType
        session.status = status || session.status
        session.workoutName = workoutName || session.workoutName
        session.workoutId = workoutId || session.workoutId
        await session.save()
        return res.status(200).json({ message: "Updated session", session })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error })

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
