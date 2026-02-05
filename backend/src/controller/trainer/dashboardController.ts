import type { Request, Response } from "express";
import TrainerClientRelation from "../../models/TrainerClientRelation";
import User from "../../models/user/User";
import Session from "../../models/Session";


export const getTrainerDashboard = async (req: Request, res: Response) => {
    try {
        const trainer = req.user
        const allClients = await TrainerClientRelation.find({ trainerId: trainer?.id })
        
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)
        
        const todaySessions = await Session.find({
            trainerId: trainer?.id,
            startTime: { $gte: today, $lt: tomorrow },
        }).populate('clientId')
        
        
        const uniqueClientIds = new Set(todaySessions.map(session => session.clientId?._id.toString()))
        const trainingToday = uniqueClientIds.size
        const percentageToday = allClients.length > 0 ? (trainingToday / allClients.length) * 100 : 0
        console.log(trainingToday)
        
        const todayStats = {
            trainingToday,
            totalSessionsToday: todaySessions.length,
            totalClients: allClients.length,
            percentage: Math.round(percentageToday),
            sessions: todaySessions.map(session => ({
                clientName: `${(session.clientId as any).firstName} ${(session.clientId as any).lastName}`,
                time: session.startTime
            }))
        }
        
        const currentDay = today.getDay() // 0 = Sunday, 1 = Monday, etc.
        const weekStart = new Date(today)
        weekStart.setDate(today.getDate() - currentDay)
        weekStart.setHours(0, 0, 0, 0)
        
        const weekEnd = new Date(weekStart)
        weekEnd.setDate(weekStart.getDate() + 7)
        
        const weekSessions = await Session.find({
            trainerId: trainer?.id,
            startTime: { $gte: weekStart, $lt: weekEnd },
        })
        
        const clientIdsThisWeek = weekSessions.map(session => session.clientId.toString())
        const uniqueClientIdsWeek = new Set(clientIdsThisWeek)
        const percentageWeek = allClients.length > 0 ? (uniqueClientIdsWeek.size / allClients.length) * 100 : 0
        
        const allClientIds = allClients.map(relation => relation.clientId.toString())
        const missingClientIds = allClientIds.filter(id => !uniqueClientIdsWeek.has(id))
        const missingClients = await User.find({ _id: { $in: missingClientIds } })
        
        const activeClientIds = Array.from(uniqueClientIdsWeek)
        const activeClients = await User.find({ _id: { $in: activeClientIds } })

        const weekStats = {
            trainingWeek: uniqueClientIdsWeek.size,
            totalSessions: weekSessions.length,
            totalClients: allClients.length,
            percentageWeek: Math.round(percentageWeek),
            active: activeClients.map(client => ({
                name: `${(client as any).firstName} ${(client as any).lastName}`,
                sessionCount: weekSessions.filter(s =>
                    s.clientId.toString() === client._id.toString()
                ).length
            })),
            missing: missingClients.map(client =>
                `${(client as any).firstName} ${(client as any).lastName}`
            )
        }
        
        
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
        const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999)
        
        const monthlySessions = await Session.find({
            trainerId: trainer?.id,
            startTime: { $gte: monthStart, $lte: monthEnd }
        })
        
        const completed = monthlySessions.filter(session => session.status === 'Completed').length
        const cancelled = monthlySessions.filter(session => session.status === 'Cancelled')
        const total = monthlySessions.length
        const monthlyPercentage = total > 0 ? (completed / total) * 100 : 0
        
        const monthlyCompletionRate = {
            percentage: Math.round(monthlyPercentage),
            completed,
            total,
            cancelled: cancelled.map(session => ({
                clientName: (session.clientId as any)?.firstName,
                date: session.startTime
            }))
        }
        
        return res.json({ todayStats, weekStats, monthlyCompletionRate })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "failed" })
    }
}