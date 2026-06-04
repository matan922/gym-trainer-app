import { useQuery } from "@tanstack/react-query"
import type { Session } from "../../types/clientTypes"
import { getSessions } from "../../services/clientApi"
import { CalendarSolidIcon } from "../../components/icons/Icons"

const SessionsClientPage = () => {
    const { data: sessions, isPending, isError, error } = useQuery<Session[]>({
        queryKey: ['clientSessions'],
        queryFn: () => getSessions(),
        staleTime: 1000 * 60 * 5, // 5 minutes
    })

    if (isPending) {
        return (
            <div className="min-h-screen bg-client p-4 lg:p-8 flex items-center justify-center">
                <span className="text-2xl text-client-dark">טוען...</span>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="min-h-screen bg-client p-4 lg:p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-right">
                        שגיאה: {error.message}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-client p-4 lg:p-8">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="mb-8 flex items-center gap-4">
                    <CalendarSolidIcon className="w-12 h-12 text-client-primary" />
                    <h1 className="text-3xl lg:text-4xl font-bold text-client-dark">
                        האימונים שלי
                    </h1>
                </div>

                {/* Sessions Grid or Empty State */}
                {sessions && sessions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                        {sessions
                            .slice()
                            .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
                            .map((session) => (
                                <div
                                    key={session._id}
                                    className="bg-surface rounded-xl shadow-xl border border-client-primary/20 p-6 hover:shadow-2xl hover:border-client-primary/40 transition-all cursor-pointer"
                                >

                                    {/* Session Header */}
                                    <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-client-primary/20">
                                        <CalendarSolidIcon className="w-8 h-8 text-client-primary" />
                                        <h2 className="text-xl font-bold text-client-dark flex-1 text-right">
                                            {new Date(session.startTime).toLocaleDateString('he-IL')}
                                        </h2>
                                    </div>

                                    {/* Session Info */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between p-3 bg-client-primary/5 rounded-lg">
                                            <span className="text-sm text-text-medium">תאריך</span>
                                            <span className="text-sm font-bold text-client-primary">
                                                {new Date(session.startTime).toLocaleDateString('he-IL', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </div>

                                        {session.workoutName && (
                                            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                                <p className="text-sm text-text-medium text-right">
                                                    {session.workoutName}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                    </div>
                ) : (
                    // Empty State
                    <div className="bg-surface rounded-xl shadow-xl border border-client-primary/20 p-12 text-center">
                        <div className="max-w-md mx-auto">
                            {/* Empty Icon */}
                            <CalendarSolidIcon className="w-20 h-20 text-text-light mx-auto mb-6" />

                            {/* Empty Message */}
                            <h2 className="text-2xl font-bold text-client-dark mb-3">
                                אין מפגשי אימון עדיין
                            </h2>
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}

export default SessionsClientPage