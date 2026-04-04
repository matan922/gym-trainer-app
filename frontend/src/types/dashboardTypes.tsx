export interface TrainerDashboard {
    todayStats: {
        percentage: number
        totalSessionsToday: number
        sessions: [{ clientName: string, time: string }]
        totalClients: number
        trainingToday: number
    },
    upcomingSessions: {
        clientName: string
        date: Date
        time: Date
        sessionType: string
    }[],
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