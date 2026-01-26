export interface TrainerDashboard {
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

export interface ClientDashboard {
    trainer: {
        id: string
        firstName: string
        lastName: string
    },
    nextSession: {
        id: string
        workoutId: string
        workoutName: string
        date: Date
        status: string
    },
    previousSession: {
        id: string
        workoutId: string
        workoutName: string
        date: Date
        status: string
    }

}