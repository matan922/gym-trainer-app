import { useEffect, useState } from "react"
import { getSessions } from "../services/api"
import type { Session } from "../types/clientTypes"
import dayjs from "dayjs"

const SessionsPage = () => {
	const [sessionsData, setSessionsData] = useState<Session[]>([])
	const [error, setError] = useState<string | null>(null)

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


	return (
		<div className="p-8 w-full flex flex-col items-center">
			<div className="max-w-lg w-full">
				<div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-6">
					<h1 className="text-3xl font-bold text-gray-800 text-center">
						אימונים
					</h1>
					<div className="flex flex-row justify-center">צריך להיות פילטור</div>
					<div className="flex flex-col gap-4">
						{error && <div className="text-red-500">{error}</div>}
						{sessionsData.map((session, index) => (
							<div
								key={index}
								className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
							>
								<div className="flex justify-between items-center">
									<h3 className="text-lg font-semibold text-gray-800">
										{session.clientId.firstName} {session.clientId.lastName}
									</h3>
									<span className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
										{session.status}
									</span>
								</div>
								<div className="mt-2 text-sm text-gray-600 space-y-1">
									<p>{dayjs(session.sessionDate).format("DD/MM/YY")}</p>
									<p>{dayjs(session.startTime).format('HH:mm')} - {dayjs(session.endTime).format('HH:mm')}</p>
									<p className="text-gray-500">{dayjs(session.startTime).fromNow()}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}

export default SessionsPage
