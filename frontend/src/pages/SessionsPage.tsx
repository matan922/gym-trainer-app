import { useEffect, useState } from "react"
import { getSessions, updateSessionStatus, updateSession } from "../services/api"
import type { Session } from "../types/clientTypes"
import dayjs from "dayjs"
import SessionStatusBadge from "../components/session/SessionStatusBadge"
import EditSessionModal from "../components/session/EditSessionModal"

const SessionsPage = () => {
	const [sessionsData, setSessionsData] = useState<Session[]>([])
	const [error, setError] = useState<string | null>(null)
	const [editingSession, setEditingSession] = useState<Session | null>(null)

	useEffect(() => {
		const getSessionsData = async () => {
			try {
				const response = await getSessions()
				if (response) {
					console.log(response)
					setSessionsData(response)
					setError(null)
				} else {
					setError(response.message)
				}
			} catch (error) {
				console.log(error)
				setError("שגיאה בטעינת האימונים")
			}
		}

		getSessionsData()
	}, [])

	const handleStatusChange = async (sessionId: string, newStatus: string) => {
		try {
			const response = await updateSessionStatus(sessionId, newStatus)
			if (response.success) {
				// Update local state
				setSessionsData(prevSessions =>
					prevSessions.map(session =>
						session._id === sessionId
							? { ...session, status: newStatus }
							: session
					)
				)
			}
		} catch (error) {
			console.error("Error updating session status:", error)
		}
	}

	const handleSaveSession = async (sessionId: string, updatedData: Partial<Session>) => {
		try {
			const response = await updateSession(sessionId, updatedData)
			if (response.success) {
				// Update local state
				setSessionsData(prevSessions =>
					prevSessions.map(session =>
						session._id === sessionId
							? { ...session, ...updatedData }
							: session
					)
				)
				setEditingSession(null)
			}
		} catch (error) {
			console.error("Error updating session:", error)
		}
	}


	return (
		<div className="min-h-screen bg-trainer p-4 lg:p-8">
			<div className="max-w-4xl mx-auto">
				<div className="bg-surface rounded-xl shadow-xl border border-trainer-primary/20 p-6 lg:p-8">
					{/* Header */}
					<div className="flex items-center justify-center gap-3 mb-6 pb-4 border-b-2 border-trainer-primary/20">
						<span className="text-4xl">📅</span>
						<h1 className="text-3xl lg:text-4xl font-bold text-trainer-dark text-center">
							אימונים
						</h1>
						<span className="text-lg text-trainer-primary font-semibold">
							({sessionsData.length})
						</span>
					</div>

					{/* Sessions List */}
					<div className="flex flex-col gap-4">
						{error && (
							<div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-right">
								{error}
							</div>
						)}
						{sessionsData.length > 0 ? (
							sessionsData.map((session, index) => (
								<div
									key={index}
									className="bg-white rounded-xl shadow-md border border-trainer-primary/20 p-5 hover:shadow-lg hover:border-trainer-primary/30 transition-all"
								>
									{/* Header with client name and actions */}
									<div className="flex justify-between items-start mb-4 pb-3 border-b border-trainer-primary/10">
										<div className="flex items-center gap-2">
											<span className="text-2xl">👤</span>
											<h3 className="text-xl font-bold text-trainer-dark">
												{session.clientId.firstName} {session.clientId.lastName}
											</h3>
										</div>
										<div className="flex gap-2 items-center">
											<SessionStatusBadge session={session} editable={true} onStatusChange={handleStatusChange} />
											<button
												onClick={() => setEditingSession(session)}
												className="px-3 py-1 bg-trainer-primary hover:bg-trainer-dark text-white rounded-lg text-sm font-medium transition-all"
											>
												✏️ עריכה
											</button>
										</div>
									</div>

									{/* Session Details */}
									<div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
										{/* Date */}
										<div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
											<span className="text-lg">📅</span>
											<div className="flex flex-col">
												<span className="text-xs text-text-medium">תאריך</span>
												<span className="text-sm font-semibold text-text-dark">
													{dayjs(session.sessionDate).format("DD/MM/YY")}
												</span>
											</div>
										</div>

										{/* Time */}
										<div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
											<span className="text-lg">🕐</span>
											<div className="flex flex-col">
												<span className="text-xs text-text-medium">שעה</span>
												<span className="text-sm font-semibold text-text-dark">
													{dayjs(session.startTime).format('HH:mm')} - {dayjs(session.endTime).format('HH:mm')}
												</span>
											</div>
										</div>

										{/* Session Type */}
										<div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
											<span className="text-lg">{session.sessionType === 'Online' ? '💻' : '🏋️'}</span>
											<div className="flex flex-col">
												<span className="text-xs text-text-medium">סוג</span>
												<span className="text-sm font-semibold text-text-dark">
													{session.sessionType === 'Online' ? 'אונליין' : 'סטודיו'}
												</span>
											</div>
										</div>

										{/* Workout */}
										{session.workoutId ? (
											<div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
												<span className="text-lg">💪</span>
												<div className="flex flex-col">
													<span className="text-xs text-text-medium">אימון</span>
													<span className="text-sm font-semibold text-text-dark">
														{session.workoutId.workoutName || `${session.workoutId.exercises?.length || 0} תרגילים`}
													</span>
												</div>
											</div>
										) : (
											<div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg opacity-50">
												<span className="text-lg">💪</span>
												<div className="flex flex-col">
													<span className="text-xs text-text-medium">אימון</span>
													<span className="text-sm font-semibold text-text-dark">
														ללא אימון מוגדר
													</span>
												</div>
											</div>
										)}
									</div>
								</div>
							))
						) : (
							<div className="text-center py-12">
								<p className="text-text-light text-lg">אין אימונים</p>
							</div>
						)}
					</div>
				</div>
			</div>

			{editingSession && (
				<EditSessionModal
					session={editingSession}
					onClose={() => setEditingSession(null)}
					onSave={handleSaveSession}
				/>
			)}
		</div>
	)
}

export default SessionsPage
