export interface Dashboard {
    todayStats: {
        percentage: number
        totalSessionsToday: number
        sessions: [{ clientName: string, time: string }]
        totalClients: number
        trainingToday: number
    },
    weekStats: {
        active: []
        missing: []
        percentageWeek: number
        totalClients: number
        totalSessions: number
        trainingWeek: number
    },
    monthlyCompletionRate: {
        cancelled: []
        completed: number
        percentage: number
        total: number
    }
}

