import { useQuery } from '@tanstack/react-query'
import type { ClientDashboard } from '../../types/dashboardTypes'
import { useAuthStore } from '../../store/authStore'
import dayjs from 'dayjs'
import { getClientDashboard } from '../../services/clientApi'

const DashboardClientPage = () => {
    const user = useAuthStore((state) => state.user)

    const { data, isPending, isError, error } = useQuery<ClientDashboard>({
        queryKey: ['clientDashboard'],
        queryFn: () => getClientDashboard(),
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

    if (!data) {
        return (
            <div className="min-h-screen bg-client p-4 lg:p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-surface border border-client-primary/20 text-text-dark p-4 rounded-lg text-right">
                        אין מידע זמין
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-client p-4 lg:p-8">
            <div className="max-w-6xl mx-auto">

                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-3xl lg:text-4xl font-bold text-client-dark mb-2">
                        💪 שלום, {user?.firstName}!
                    </h1>
                    <p className="text-text-dark text-lg font-medium">
                        המסע שלך להישגים חדשים מתחיל כאן
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">

                    {/* Card 1: Trainer Info */}
                    <div className="bg-surface rounded-xl shadow-xl border border-client-primary/20 p-6">
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-client-primary/20">
                            <span className="text-3xl">🏋️</span>
                            <h2 className="text-xl font-bold text-client-dark">המאמן שלי</h2>
                        </div>

                        {/* Trainer Details */}
                        <div className="text-center py-6">
                            <div className="w-20 h-20 bg-client-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-4xl">👤</span>
                            </div>
                            <h3 className="text-2xl font-bold text-client-dark mb-1">
                                {data.trainer.firstName} {data.trainer.lastName}
                            </h3>
                            <p className="text-sm text-text-medium">מאמן אישי</p>
                        </div>

                        {/* Contact/Info Section */}
                        <div className="mt-4 p-3 bg-client-primary/5 rounded-lg">
                            <p className="text-sm text-text-medium text-center">
                                המאמן שלך כאן כדי לעזור לך להגיע ליעדים שלך! 🎯
                            </p>
                        </div>
                    </div>

                    {/* Card 2: Next Session */}
                    <div className="bg-surface rounded-xl shadow-xl border border-client-primary/20 p-6">
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-client-primary/20">
                            <span className="text-3xl">📅</span>
                            <h2 className="text-xl font-bold text-client-dark">האימון הבא</h2>
                        </div>

                        {data.nextSession ? (
                            <div className="py-4">
                                {/* Date Display */}
                                <div className="text-center mb-6">
                                    <div className="text-4xl font-bold text-client-primary mb-2">
                                        {dayjs(data.nextSession.date).format('DD/MM')}
                                    </div>
                                    <div className="text-lg text-text-medium mb-1">
                                        {dayjs(data.nextSession.date).format('dddd')}
                                    </div>
                                    <div className="text-2xl font-semibold text-client-dark">
                                        {dayjs(data.nextSession.date).format('HH:mm')}
                                    </div>
                                </div>

                                {/* Status Badge */}
                                <div className="flex justify-center">
                                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                                        data.nextSession.status === 'scheduled'
                                            ? 'bg-client-primary/10 text-client-dark'
                                            : 'bg-gray-100 text-text-medium'
                                    }`}>
                                        {data.nextSession.status === 'scheduled' ? '✓ מתוזמן' : data.nextSession.status}
                                    </span>
                                </div>

                                {/* Time Until */}
                                <div className="mt-4 p-3 bg-client-primary/5 rounded-lg">
                                    <p className="text-sm text-text-medium text-center">
                                        {dayjs(data.nextSession.date).fromNow()}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="text-6xl mb-4">📭</div>
                                <p className="text-text-medium mb-2">אין אימון מתוזמן</p>
                                <p className="text-sm text-text-light">
                                    צור קשר עם המאמן שלך לתיאום אימון
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Card 3: Previous Session */}
                    <div className="bg-surface rounded-xl shadow-xl border border-client-primary/20 p-6">
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-client-primary/20">
                            <span className="text-3xl">✅</span>
                            <h2 className="text-xl font-bold text-client-dark">אימון אחרון</h2>
                        </div>

                        {data.previousSession ? (
                            <div className="py-4">
                                {/* Date Display */}
                                <div className="text-center mb-6">
                                    <div className="text-4xl font-bold text-client-primary mb-2">
                                        {dayjs(data.previousSession.date).format('DD/MM')}
                                    </div>
                                    <div className="text-lg text-text-medium mb-1">
                                        {dayjs(data.previousSession.date).format('dddd')}
                                    </div>
                                    <div className="text-2xl font-semibold text-client-dark">
                                        {dayjs(data.previousSession.date).format('HH:mm')}
                                    </div>
                                </div>

                                {/* Status Badge */}
                                <div className="flex justify-center">
                                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                                        data.previousSession.status === 'completed'
                                            ? 'bg-green-100 text-green-700'
                                            : data.previousSession.status === 'cancelled'
                                            ? 'bg-red-100 text-red-700'
                                            : 'bg-gray-100 text-text-medium'
                                    }`}>
                                        {data.previousSession.status === 'completed' ? '✓ הושלם' :
                                         data.previousSession.status === 'cancelled' ? '✗ בוטל' :
                                         data.previousSession.status}
                                    </span>
                                </div>

                                {/* Time Since */}
                                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                                    <p className="text-sm text-green-700 text-center font-medium">
                                        💪 כל הכבוד! {dayjs(data.previousSession.date).fromNow()}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="text-6xl mb-4">🚀</div>
                                <p className="text-text-medium mb-2">עדיין לא היה אימון</p>
                                <p className="text-sm text-text-light">
                                    האימון הראשון שלך מחכה!
                                </p>
                            </div>
                        )}
                    </div>

                </div>

            </div>
        </div>
    )
}

export default DashboardClientPage