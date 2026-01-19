import type { Request, Response } from "express";
import Session from "../../models/Session.js";
import TrainerClientRelation from "../../models/TrainerClientRelation.js";

export const getSessions = async (req: Request, res: Response) => {
    try {
        const user = req.user
        const { filter, timeRange, specificDate } = req.query
        const { clientId } = req.params // This will be undefined if not in the route

        const now = new Date()
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        let query: any = { trainerId: user?.id }

        // Add clientId filter if provided
        if (clientId) {
            query.clientId = clientId
        }

        // Apply date range filters (specificDate takes priority over timeRange)
        if (specificDate && typeof specificDate === 'string') {
            // Specific date selected - show only that day
            const selectedDate = new Date(specificDate)
            const startOfDay = new Date(selectedDate)
            startOfDay.setHours(0, 0, 0, 0)
            const endOfDay = new Date(selectedDate)
            endOfDay.setHours(23, 59, 59, 999)
            query.startTime = { $gte: startOfDay, $lte: endOfDay }
        }
        else if (timeRange === 'today') {
            // This calendar day (midnight to midnight)
            const startOfToday = new Date(today)
            startOfToday.setHours(0, 0, 0, 0)
            const endOfToday = new Date(today)
            endOfToday.setHours(23, 59, 59, 999)
            query.startTime = { $gte: startOfToday, $lte: endOfToday }
        }
        else if (timeRange === 'week') {
            // This calendar week (Monday 00:00 - Sunday 23:59)
            const startOfWeek = new Date(today)
            const dayOfWeek = startOfWeek.getDay() // 0 = Sunday, 1 = Monday, etc.
            const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1 // Convert Sunday=0 to 6, Mon-Sat to 0-5
            startOfWeek.setDate(startOfWeek.getDate() - daysFromMonday)
            startOfWeek.setHours(0, 0, 0, 0)

            const endOfWeek = new Date(startOfWeek)
            endOfWeek.setDate(startOfWeek.getDate() + 6) // Monday + 6 days = Sunday
            endOfWeek.setHours(23, 59, 59, 999)

            query.startTime = { $gte: startOfWeek, $lte: endOfWeek }
        }
        else if (timeRange === 'month') {
            // This calendar month (1st 00:00 - last day 23:59)
            const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
            startOfMonth.setHours(0, 0, 0, 0)

            const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0) // Day 0 of next month = last day of current month
            endOfMonth.setHours(23, 59, 59, 999)

            query.startTime = { $gte: startOfMonth, $lte: endOfMonth }
        }
        // else no timeRange specified - no date filter

        // Apply status filters (preserve date filters)
        if (!filter) {
            // No status filter
        }
        else if (filter === 'overdue') {
            query.status = 'Scheduled'
            // Combine with existing date filter if present
            if (query.startTime && typeof query.startTime === 'object') {
                // Keep date range limits, add overdue condition
                query.startTime = { ...query.startTime, $lt: now }
            } else {
                // No date range, just overdue
                query.startTime = { $lt: now }
            }
        }
        else if (filter === 'upcoming') {
            query.status = 'Scheduled'
            // Combine with existing date filter if present
            if (query.startTime && typeof query.startTime === 'object') {
                // Keep date range limits, add upcoming condition
                query.startTime = { ...query.startTime, $gte: now }
            } else {
                // No date range, just upcoming
                query.startTime = { $gte: now }
            }
        }
        else if (filter === 'completed') {
            query.status = 'Completed'
            // Status-only filter, don't touch date range
        }
        else if (filter === 'cancelled') {
            query.status = 'Cancelled'
            // Status-only filter, don't touch date range
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
