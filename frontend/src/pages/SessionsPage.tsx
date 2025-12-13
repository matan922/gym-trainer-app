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
		<div className="p-8 w-full flex flex-col items-center">
			<div className="max-w-lg w-full">
				<div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-6">
					<h1 className="text-3xl font-bold text-gray-800 text-center">
						אימונים
					</h1>
					{/* <div className="flex flex-row justify-center">צריך להיות פילטור</div> */}
					<div className="flex flex-col gap-4">
						{error && <div className="text-red-500">{error}</div>}
						{sessionsData.length > 0 ? (
							sessionsData.map((session, index) => (
								<div
									key={index}
									className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
								>
									<div className="flex justify-between items-center">
										<h3 className="text-lg font-semibold text-gray-800">
											{session.clientId.firstName} {session.clientId.lastName}
										</h3>
										<div className="flex gap-2 items-center">
											<SessionStatusBadge session={session} editable={true} onStatusChange={handleStatusChange} />
											<button
												onClick={() => setEditingSession(session)}
												className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm transition-colors"
											>
												עריכה
											</button>
										</div>
									</div>
									<div className="mt-2 text-sm text-gray-600 space-y-1">
										<p>{dayjs(session.sessionDate).format("DD/MM/YY")}</p>
										<p>{dayjs(session.startTime).format('HH:mm')} - {dayjs(session.endTime).format('HH:mm')}</p>
										<span className={`text-xs px-2 py-1 rounded ${session.sessionType === 'Online' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}`}>
											{session.sessionType === 'Online' ? 'אונליין' : 'סטודיו'}
										</span>
									</div>
								</div>
							))
						) : (
							<p className="text-center text-gray-500">אין אימונים</p>
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
