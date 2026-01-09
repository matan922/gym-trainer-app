import { useEffect, useState } from "react"
import { getDashboard } from "../services/api"
import { useAuthStore } from "../store/authStore"
import dayjs from "dayjs"
import type { Dashboard } from "../types/dashboardTypes"

const DashboardMainPage = () => {
	const user = useAuthStore((state) => state.user)

	const [dashboardData, setDashboardData] = useState<Dashboard>({
		todayStats: {
			percentage: 0,
			totalSessionsToday: 0,
			sessions: [{ clientName: '', time: '' }],
			totalClients: 0,
			trainingToday: 0
		},
		weekStats: {
			active: [],
			missing: [],
			percentageWeek: 0,
			totalClients: 0,
			totalSessions: 0,
			trainingWeek: 0,
		},
		monthlyCompletionRate: {
			cancelled: [],
			completed: 0,
			percentage: 0,
			total: 0
		}
	})
	const [error, setError] = useState<string | null>(null)
	const totalSessionsToday = dashboardData.todayStats.totalSessionsToday
	const sessions = dashboardData.todayStats.sessions

	useEffect(() => {
		const getDashboardData = async () => {
			try {
				const response = await getDashboard()
				if ('message' in response) {
					// if failed
					setError(response.message)
				} else {
					// if success
					setDashboardData({ "todayStats": response.todayStats, "weekStats": response.weekStats, "monthlyCompletionRate": response.monthlyCompletionRate })
					setError(null)
				}
			} catch (error) {
				console.log(error)
				setError("שגיאה בטעינת האימונים")
			}
		}

		getDashboardData()
	}, [])

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

				{/* Error Message */}
				{error && (
					<div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-right">
						{error}
					</div>
				)}

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
								{dashboardData.todayStats.trainingToday}/{dashboardData.todayStats.totalClients}
							</div>
							<div className="text-sm text-text-medium">
								{dashboardData.todayStats.percentage}% מהלקוחות מתאמנים היום
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
								<div className="text-4xl mb-2">🎉</div>
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
								({dashboardData.weekStats.trainingWeek})
							</span>
						</div>

						{/* Stats Summary */}
						<div className="mb-4">
							<div className="text-2xl font-bold text-trainer-primary mb-1">
								{dashboardData.weekStats.trainingWeek}/{dashboardData.weekStats.totalClients}
							</div>
							<div className="text-sm text-text-medium mb-3">
								{dashboardData.weekStats.percentageWeek}% מהלקוחות אומנו השבוע
							</div>

							{/* Progress Bar */}
							<div className="w-full bg-gray-200 rounded-full h-2 mb-3">
								<div
									className="bg-trainer-primary h-2 rounded-full transition-all"
									style={{ width: `${dashboardData.weekStats.percentageWeek}%` }}
								></div>
							</div>
						</div>

						{/* Breakdown */}
						<div className="space-y-2">
							<div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
								<span className="text-sm text-text-medium">אימנו</span>
								<span className="text-sm font-bold text-green-700">
									{dashboardData.weekStats.trainingWeek}
								</span>
							</div>
							{dashboardData.weekStats.missing.length > 0 && (
								<div className="flex items-center justify-between p-2 bg-orange-50 rounded-lg">
									<span className="text-sm text-text-medium">לא אומנו</span>
									<span className="text-sm font-bold text-orange-700">
										{dashboardData.weekStats.missing.length}
									</span>
								</div>
							)}
							<div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
								<span className="text-sm text-text-medium">סה"כ אימונים</span>
								<span className="text-sm font-bold text-blue-700">
									{dashboardData.weekStats.totalSessions}
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
								{dashboardData.monthlyCompletionRate.percentage >= 90 ? '🟢' :
									dashboardData.monthlyCompletionRate.percentage >= 75 ? '🟡' : '🔴'}
							</span>
						</div>

						{/* Stats Summary */}
						<div className="mb-4">
							<div className="text-2xl font-bold text-trainer-primary mb-1">
								{dashboardData.monthlyCompletionRate.percentage}%
							</div>
							<div className="text-sm text-text-medium mb-3">
								השלמת אימונים החודש
							</div>

							{/* Progress Bar */}
							<div className="w-full bg-gray-200 rounded-full h-2 mb-3">
								<div
									className={`h-2 rounded-full transition-all ${dashboardData.monthlyCompletionRate.percentage >= 90 ? 'bg-green-500' :
											dashboardData.monthlyCompletionRate.percentage >= 75 ? 'bg-yellow-500' : 'bg-red-500'
										}`}
									style={{ width: `${dashboardData.monthlyCompletionRate.percentage}%` }}
								></div>
							</div>
						</div>

						{/* Breakdown */}
						<div className="space-y-2">
							<div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
								<span className="text-sm text-text-medium">✅ הושלמו</span>
								<span className="text-sm font-bold text-green-700">
									{dashboardData.monthlyCompletionRate.completed}
								</span>
							</div>
							{dashboardData.monthlyCompletionRate.cancelled.length > 0 && (
								<div className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
									<span className="text-sm text-text-medium">❌ בוטלו</span>
									<span className="text-sm font-bold text-red-700">
										{dashboardData.monthlyCompletionRate.cancelled.length}
									</span>
								</div>
							)}
							<div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
								<span className="text-sm text-text-medium">📊 סה"כ</span>
								<span className="text-sm font-bold text-blue-700">
									{dashboardData.monthlyCompletionRate.total}
								</span>
							</div>
						</div>
					</div>
				</div>

			</div>
		</div>)
}

export default DashboardMainPage
// <div className="flex flex-col gap-4 p-4 lg:p-8 items-center">
// 	<div className="w-full max-w-2xl">
// 		<div className="flex flex-col gap-4">
// 			{error && (
// 				<div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded text-right">
// 					{error}
// 				</div>
// 			)}
// 			<div className="bg-white rounded-lg shadow p-4 lg:p-8">
// 				<div className="flex items-center gap-2 mb-4">
// 					<span className="text-xl lg:text-2xl font-bold">היום:</span>
// 					<span className="text-xl lg:text-2xl">{todaysSessions.length} אימונים</span>
// 				</div>
// 				<div className="max-h-64 overflow-y-auto flex flex-col gap-2">
// 					{todaysSessions
// 						.sort((a, b) => dayjs(a.startTime).diff(dayjs(b.startTime)))
// 						.map((session, i) => (
// 							<div className="flex flex-wrap items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100" key={i}>
// 								<span className="font-semibold min-w-[120px]">
// 									{session.clientId.firstName} {session.clientId.lastName}
// 								</span>
// 								<SessionStatusBadge session={session} editable={true} onStatusChange={handleStatusChange} />
// 								<span className={`text-xs px-2 py-1 rounded ${session.sessionType === 'Online' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}`}>
// 									{session.sessionType === 'Online' ? 'אונליין' : 'סטודיו'}
// 								</span>
// 								<span className="text-gray-600 text-sm lg:text-base ml-auto">
// 									{dayjs(session.startTime).format("HH:mm")} -{" "}
// 									{dayjs(session.endTime).format("HH:mm")}
// 								</span>
// 							</div>
// 						))}
// 				</div>
// 			</div>
// 			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
// 				{/* <div className="bg-white rounded-lg shadow p-6">asd</div>
// 				<div className="bg-white rounded-lg shadow p-6">asd</div> */}
// 			</div>
// 		</div>
// 	</div>
// </div>
