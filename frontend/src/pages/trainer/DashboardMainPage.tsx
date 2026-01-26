import { getTrainerDashboard } from "../../services/trainerApi"
import { useAuthStore } from "../../store/authStore"
import dayjs from "dayjs"
import { useQuery } from "@tanstack/react-query"

const DashboardMainPage = () => {
	const user = useAuthStore((state) => state.user)

	const { data, isPending, isError, error } = useQuery({
		queryKey: ['dashboard'],
		queryFn: () => getTrainerDashboard(),
		staleTime: 1000 * 60 * 5, // 5 minutes
	})

	if (isPending) {
		return (
			<div className="min-h-screen bg-trainer p-4 lg:p-8 flex items-center justify-center">
				<span className="text-2xl text-trainer-dark">טוען...</span>
			</div>
		)
	}

	if (isError) {
		return (
			<div className="min-h-screen bg-trainer p-4 lg:p-8">
				<div className="max-w-6xl mx-auto">
					<div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-right">
						שגיאה: {error.message}
					</div>
				</div>
			</div>
		)
	}

	const { todayStats, weekStats, monthlyCompletionRate } = data
	const totalSessionsToday = todayStats.totalSessionsToday
	const sessions = todayStats.sessions

	return (
		<div className="min-h-screen bg-trainer p-4 lg:p-8">
			<div className="max-w-6xl mx-auto">

				{/* Welcome Section */}
				<div className="mb-8">
					<h1 className="text-3xl lg:text-4xl font-bold text-trainer-dark mb-2">
						🔥 שלום, {user?.firstName}!
					</h1>
					<p className="text-text-dark text-lg font-medium">
						{totalSessionsToday === 0 && "אין אימונים היום"}
						{totalSessionsToday === 1 && "יש לך אימון אחד היום"}
						{totalSessionsToday > 1 && `יש לך ${totalSessionsToday} אימונים היום`}
					</p>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-8">

					{/* Card 1: Today's Sessions - Combined */}
					<div className="bg-surface rounded-xl shadow-xl border border-trainer-primary/20 p-6 lg:col-span-1">
						{/* Header */}
						<div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-trainer-primary/20">
							<span className="text-3xl">🔥</span>
							<h2 className="text-xl font-bold text-trainer-dark">אימונים היום</h2>
							<span className="text-base text-trainer-primary font-semibold mr-auto">
								({totalSessionsToday})
							</span>
						</div>

						{/* Stats Summary */}
						<div className="mb-4">
							<div className="text-2xl font-bold text-trainer-primary mb-1">
								{todayStats.trainingToday}/{todayStats.totalClients}
							</div>
							<div className="text-sm text-text-medium">
								{todayStats.percentage}% מהלקוחות מתאמנים היום
							</div>
						</div>

						{/* Sessions List */}
						{totalSessionsToday > 0 ? (
							<div className="space-y-2">
								{sessions
									.sort((a, b) => dayjs(a.time).diff(dayjs(b.time)))
									.map((session, i) => (
										<div
											key={i}
											className="flex items-center justify-between p-3 bg-white rounded-lg border-r-4 border-trainer-primary hover:shadow-md hover:bg-sidebar-item-hover-trainer transition-all"
										>
											<span className="font-semibold text-text-dark">
												{session.clientName}
											</span>
											<span className="text-trainer-primary font-bold">
												{dayjs(session.time).format("HH:mm")}
											</span>
										</div>
									))}
							</div>
						) : (
							<div className="text-center py-8">
								<p className="text-text-light text-sm">אין אימונים להיום</p>
							</div>
						)}
					</div>

					{/* Card 2: Week's Active Clients - Enhanced */}
					<div className="bg-surface rounded-xl shadow-xl border border-trainer-primary/20 p-6">
						{/* Header */}
						<div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-trainer-primary/20">
							<span className="text-3xl">💪</span>
							<h2 className="text-xl font-bold text-trainer-dark">השבוע</h2>
							<span className="text-base text-trainer-primary font-semibold mr-auto">
								({weekStats.trainingWeek})
							</span>
						</div>

						{/* Stats Summary */}
						<div className="mb-4">
							<div className="text-2xl font-bold text-trainer-primary mb-1">
								{weekStats.trainingWeek}/{weekStats.totalClients}
							</div>
							<div className="text-sm text-text-medium mb-3">
								{weekStats.percentageWeek}% מהלקוחות אומנו השבוע
							</div>

							{/* Progress Bar */}
							<div className="w-full bg-gray-200 rounded-full h-2 mb-3">
								<div
									className="bg-trainer-primary h-2 rounded-full transition-all"
									style={{ width: `${weekStats.percentageWeek}%` }}
								></div>
							</div>
						</div>

						{/* Breakdown */}
						<div className="space-y-2">
							<div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
								<span className="text-sm text-text-medium">אימנו</span>
								<span className="text-sm font-bold text-green-700">
									{weekStats.trainingWeek}
								</span>
							</div>
							{weekStats.missing.length > 0 && (
								<div className="flex items-center justify-between p-2 bg-orange-50 rounded-lg">
									<span className="text-sm text-text-medium">לא אומנו</span>
									<span className="text-sm font-bold text-orange-700">
										{weekStats.missing.length}
									</span>
								</div>
							)}
							<div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
								<span className="text-sm text-text-medium">סה"כ אימונים</span>
								<span className="text-sm font-bold text-blue-700">
									{weekStats.totalSessions}
								</span>
							</div>
						</div>
					</div>

					{/* Card 3: Monthly Completion Rate - Enhanced */}
					<div className="bg-surface rounded-xl shadow-xl border border-trainer-primary/20 p-6">
						{/* Header */}
						<div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-trainer-primary/20">
							<span className="text-3xl">✅</span>
							<h2 className="text-xl font-bold text-trainer-dark">החודש</h2>
							<span className="text-2xl mr-auto">
								{monthlyCompletionRate.percentage >= 90 ? '🟢' :
									monthlyCompletionRate.percentage >= 75 ? '🟡' : '🔴'}
							</span>
						</div>

						{/* Stats Summary */}
						<div className="mb-4">
							<div className="text-2xl font-bold text-trainer-primary mb-1">
								{monthlyCompletionRate.percentage}%
							</div>
							<div className="text-sm text-text-medium mb-3">
								השלמת אימונים החודש
							</div>

							{/* Progress Bar */}
							<div className="w-full bg-gray-200 rounded-full h-2 mb-3">
								<div
									className={`h-2 rounded-full transition-all ${monthlyCompletionRate.percentage >= 90 ? 'bg-green-500' :
										monthlyCompletionRate.percentage >= 75 ? 'bg-yellow-500' : 'bg-red-500'
										}`}
									style={{ width: `${monthlyCompletionRate.percentage}%` }}
								></div>
							</div>
						</div>

						{/* Breakdown */}
						<div className="space-y-2">
							<div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
								<span className="text-sm text-text-medium">✅ הושלמו</span>
								<span className="text-sm font-bold text-green-700">
									{monthlyCompletionRate.completed}
								</span>
							</div>
							{monthlyCompletionRate.cancelled.length > 0 && (
								<div className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
									<span className="text-sm text-text-medium">❌ בוטלו</span>
									<span className="text-sm font-bold text-red-700">
										{monthlyCompletionRate.cancelled.length}
									</span>
								</div>
							)}
							<div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
								<span className="text-sm text-text-medium">📊 סה"כ</span>
								<span className="text-sm font-bold text-blue-700">
									{monthlyCompletionRate.total}
								</span>
							</div>
						</div>
					</div>
				</div>

			</div>
		</div>
	)
}

export default DashboardMainPage
