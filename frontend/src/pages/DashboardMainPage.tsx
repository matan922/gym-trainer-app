import { useEffect, useState } from "react"
import { getSessions } from "../services/api"
import type { Session } from "../types/clientTypes"
import dayjs from "dayjs"

const DashboardMainPage = () => {
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

	const todaysSessions = sessionsData.filter((session) =>
		dayjs(session.sessionDate).isSame(dayjs().startOf("day")),
	)

	return (
		<div className="flex flex-col gap-4 p-4 lg:p-8 items-center">
			<div className="w-full max-w-2xl">
				<div className="flex flex-col gap-4">
					{error && (
						<div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded text-right">
							{error}
						</div>
					)}
					<div className="bg-white rounded-lg shadow p-4 lg:p-8">
						<div className="flex items-center gap-2 mb-4">
							<span className="text-xl lg:text-2xl font-bold">היום:</span>
							<span className="text-xl lg:text-2xl">{todaysSessions.length} אימונים</span>
						</div>
						<div className="max-h-64 overflow-y-auto flex flex-col gap-2">
							{todaysSessions
								.sort((a, b) => dayjs(a.startTime).diff(dayjs(b.startTime)))
								.map((session, i) => (
									<div className="flex flex-wrap items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100" key={i}>
										<span className="font-semibold min-w-[120px]">
											{session.clientId.firstName} {session.clientId.lastName}
										</span>
										<span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs lg:text-sm">
											{session.status}
										</span>
										<span className="text-gray-600 text-sm lg:text-base ml-auto">
											{dayjs(session.startTime).format("HH:mm")} -{" "}
											{dayjs(session.endTime).format("HH:mm")}
										</span>
									</div>
								))}
						</div>
					</div>
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
						<div className="bg-white rounded-lg shadow p-6">asd</div>
						<div className="bg-white rounded-lg shadow p-6">asd</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default DashboardMainPage
