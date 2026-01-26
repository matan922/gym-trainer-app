import Session from "../../models/Session"
import TrainerClientRelation from "../../models/TrainerClientRelation"

const getSpecificDate = (specificDate: string) => {
    // Specific date selected - show only that day
    const selectedDate = new Date(specificDate)
    const startOfDay = new Date(selectedDate)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(selectedDate)
    endOfDay.setHours(23, 59, 59, 999)
    return { $gte: startOfDay, $lte: endOfDay }

}

const getTimeRange = (timeRange: string, today: Date) => {
    if (timeRange === 'today') {
        const startOfToday = new Date(today)
        startOfToday.setHours(0, 0, 0, 0)
        const endOfToday = new Date(today)
        endOfToday.setHours(23, 59, 59, 999)
        return { $gte: startOfToday, $lte: endOfToday }
    }
    else if (timeRange === 'week') {
        const startOfWeek = new Date(today)
        const dayOfWeek = startOfWeek.getDay() // 0 = Sunday, 1 = Monday, etc.
        const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1 // Convert Sunday=0 to 6, Mon-Sat to 0-5
        startOfWeek.setDate(startOfWeek.getDate() - daysFromMonday)
        startOfWeek.setHours(0, 0, 0, 0)

        const endOfWeek = new Date(startOfWeek)
        endOfWeek.setDate(startOfWeek.getDate() + 6) // Monday + 6 days = Sunday
        endOfWeek.setHours(23, 59, 59, 999)
        return { $gte: startOfWeek, $lte: endOfWeek }

    }
    else if (timeRange === 'month') {
        // This calendar month (1st 00:00 - last day 23:59)
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
        startOfMonth.setHours(0, 0, 0, 0)

        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0) // Day 0 of next month = last day of current month
        endOfMonth.setHours(23, 59, 59, 999)
        return { $gte: startOfMonth, $lte: endOfMonth }
    }
}

const applyFilter = (filter: string, query: any, now: Date) => {
    if (filter === 'overdue') {
        query.status = 'Scheduled'
        // Combine with existing date filter if present
        if (query.startTime && typeof query.startTime === 'object') {
            // Keep date range limits, add overdue condition
            query.startTime = { ...query.startTime, $lt: now }
        } else {
            // No date range, just overdue
            query.startTime = { $lt: now }
        }
    } else if (filter === 'upcoming') {
        query.status = 'Scheduled'
        // Combine with existing date filter if present
        if (query.startTime && typeof query.startTime === 'object') {
            // Keep date range limits, add upcoming condition
            query.startTime = { ...query.startTime, $gte: now }
        } else {
            // No date range, just upcoming
            query.startTime = { $gte: now }
        }
    } else if (filter === 'completed') {
        query.status = 'Completed'
        // Status-only filter, don't touch date range
    } else if (filter === 'cancelled') {
        query.status = 'Cancelled'
        // Status-only filter, don't touch date range
    }


}

export const getSessionsForClient = async (userId: string, filterValue: string, timeRangeValue: string, specificDateValue: string) => {
    const now = new Date()
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    let query: any = { clientId: userId }

    // Apply date range filters (specificDate takes priority over timeRange)
    if (specificDateValue && typeof specificDateValue === 'string') {
        const specificDate = getSpecificDate(specificDateValue)
        query.startTime = specificDate
    }
    else if (timeRangeValue) {
        const timeRange = getTimeRange(timeRangeValue, today)
        query.startTime = timeRange
    }


    if (!filterValue) {
        // No status filterValue
    }
    applyFilter(filterValue, query, now)
    const sessions = await Session.find(query).populate({ path: "clientId" }).populate({ path: "workoutId" }).sort({ startTime: 1 })
    return sessions
}

export const getSessionsForTrainer = async (userId: string, clientId: string, filterValue: string, timeRangeValue: string, specificDateValue: string) => {
    const now = new Date()
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    let query: any = { trainerId: userId }

    if (clientId) {
        query.clientId = clientId
    }

    // Apply date range filters (specificDate takes priority over timeRange)
    if (specificDateValue && typeof specificDateValue === 'string') {
        const specificDate = getSpecificDate(specificDateValue)
        query.startTime = specificDate
    }
    else if (timeRangeValue) {
        const timeRange = getTimeRange(timeRangeValue, today)
        query.startTime = timeRange
    }


    if (!filterValue) {
        // No status filterValue
    }
    applyFilter(filterValue, query, now)
    const sessions = await Session.find(query).populate({ path: "clientId" }).populate({ path: "workoutId" }).sort({ startTime: 1 })
    return sessions
}