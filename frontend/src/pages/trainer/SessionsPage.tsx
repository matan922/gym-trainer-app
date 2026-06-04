import { useState } from "react"
import { getSessions, updateSessionStatus, updateSession, getClient } from "../../services/trainerApi"
import type { Session } from "../../types/clientTypes"
import dayjs from "dayjs"
import SessionStatusBadge from "../../components/session/SessionStatusBadge"
import EditSessionModal from "../../components/session/EditSessionModal"
import { useNavigate, useParams, useSearchParams } from "react-router"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { CalendarIcon, UserIcon, EditIcon, ClockIcon } from "../../components/icons/Icons"
import BackButton from "../../components/general/BackButton"


const SessionsPage = () => {
	const [editingSession, setEditingSession] = useState<Session | null>(null)
	const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('week')
	const [specificDate, setSpecificDate] = useState<Date | null>(null)
	const navigate = useNavigate()
	const [searchParams, setSearchParams] = useSearchParams()
	const filter = searchParams.get('filter') || undefined
	const { clientId } = useParams()

	const queryClient = useQueryClient()

	const { isPending, isError, data, error } = useQuery<Session[]>({
		queryKey: ['sessions', filter, clientId, timeRange, specificDate?.toISOString()],
		queryFn: () => getSessions(filter, clientId, timeRange, specificDate)
	})

	const { data: clientData } = useQuery({
		queryKey: ['client', clientId],
		queryFn: () => getClient(clientId!),
		enabled: !!clientId
	})


	const statusMutation = useMutation({
		mutationFn: ({ sessionId, newStatus }: { sessionId: string; newStatus: string }) => updateSessionStatus(sessionId, newStatus),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['sessions'] })
		},
		onError: (error) => {
			console.error("Error updating session status:", error)
		}
	})

	const sessionMutation = useMutation({
		mutationFn: ({ sessionId, updatedData }: { sessionId: string; updatedData: Partial<Session> }) => updateSession(sessionId, updatedData),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['sessions'] })
			setEditingSession(null)
		},
		onError: (error) => {
			console.error("Error updating session:", error)
		}
	})

	const handleStatusChange = (sessionId: string, newStatus: string) => {
		statusMutation.mutate({ sessionId, newStatus })
	}

	const handleFilterChange = (newFilter: string) => {
		setSearchParams({ filter: newFilter })
	}

	const handleClearFilter = () => {
		setSearchParams({})
	}

	const handleSaveSession = (sessionId: string, updatedData: Partial<Session>) => {
		sessionMutation.mutate({ sessionId, updatedData })
	}

	const handleTimeRangeChange = (newTimeRange: 'today' | 'week' | 'month') => {
		setTimeRange(newTimeRange)
		setSpecificDate(null) // Clear specific date when changing time range
	}

	const handleDateChange = (date: Date | null) => {
		setSpecificDate(date)
	}

	if (isPending) {
		return <span>טוען...</span>
	}

	if (isError) {
		return <span>Error: {error.message}</span>
	}


	const sessions = data ?? []
	const clientName = clientData?.client
		? `${clientData.client.firstName} ${clientData.client.lastName}`
		: ''
	return (
		<div className="min-h-screen bg-trainer p-4 lg:p-8">
			<div className="max-w-4xl mx-auto">
				<div className="bg-surface rounded-xl shadow-xl border border-trainer-primary/20 p-6 lg:p-8">
					{clientId && <BackButton />}
					{/* Header */}
					<div className="flex items-center justify-center gap-3 mb-6 pb-4 border-b-2 border-trainer-primary/20">
						<h1 className="text-3xl lg:text-4xl font-bold text-trainer-dark text-center">
							{clientId && clientName ? `היסטוריית מפגשים של ${clientName}` : 'היסטוריית מפגשים'}
						</h1>
						<span className="text-lg text-trainer-primary font-semibold">
							({sessions.length})
						</span>
					</div>

					{/* Sessions List */}
					<div className="flex flex-col gap-4">
						{error && (
							<div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-right">
								{error}
							</div>
						)}

						{/* Time Range Filters */}
						<div className="mb-2">
							<label className="text-sm text-text-medium mb-2 text-right flex items-center gap-2">
								<CalendarIcon className="w-5 h-5 text-trainer-primary" />
								טווח זמן
							</label>
							<div className="flex gap-2 flex-wrap">
								<button
									onClick={() => handleTimeRangeChange('today')}
									className={`px-4 py-2 rounded-lg font-semibold transition-all ${timeRange === 'today' && !specificDate ? 'bg-trainer-primary text-white' : 'bg-gray-200 text-text-dark hover:bg-gray-300'}`}
								>
									היום
								</button>
								<button
									onClick={() => handleTimeRangeChange('week')}
									className={`px-4 py-2 rounded-lg font-semibold transition-all ${timeRange === 'week' && !specificDate ? 'bg-trainer-primary text-white' : 'bg-gray-200 text-text-dark hover:bg-gray-300'}`}
								>
									השבוע
								</button>
								<button
									onClick={() => handleTimeRangeChange('month')}
									className={`px-4 py-2 rounded-lg font-semibold transition-all ${timeRange === 'month' && !specificDate ? 'bg-trainer-primary text-white' : 'bg-gray-200 text-text-dark hover:bg-gray-300'}`}
								>
									החודש
								</button>
							</div>
						</div>

						{/* Specific Date Picker */}
						<div className="mb-4">
							<label className="text-sm text-text-medium mb-2 text-right flex items-center gap-2">
								<CalendarIcon className="w-5 h-5 text-trainer-primary" />
								או בחר תאריך ספציפי
							</label>
							<DatePicker
								wrapperClassName="w-full max-w-xs"
								placeholderText="בחר תאריך ספציפי"
								className="w-full px-4 py-3 border border-trainer-primary/20 rounded-lg bg-white focus:ring-2 focus:ring-trainer-primary focus:border-trainer-primary outline-none transition-all text-right"
								selected={specificDate}
								onChange={handleDateChange}
								dateFormat="dd/MM/yyyy"
								isClearable
								withPortal
							/>
							{specificDate && (
								<p className="text-xs text-trainer-primary mt-1 text-right">
									מציג מפגשים ל-{dayjs(specificDate).format('DD/MM/YYYY')}
								</p>
							)}
						</div>

						{/* Status Filters */}
						<div>
							<label className="text-sm text-text-medium mb-2 text-right flex items-center gap-2">
								סטטוס
							</label>
							<div className="flex gap-2 mb-4 flex-wrap">
								<button
									onClick={handleClearFilter}
									className={`px-4 py-2 rounded-lg font-semibold transition-all ${!filter ? 'bg-trainer-primary text-white' : 'bg-gray-200 text-text-dark hover:bg-gray-300'}`}
								>
									הכל
								</button>
								<button
									onClick={() => handleFilterChange("overdue")}
									className={`px-4 py-2 rounded-lg font-semibold transition-all ${filter === 'overdue' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-text-dark hover:bg-gray-300'}`}
								>
									ממתין לסיום
								</button>
								<button
									onClick={() => handleFilterChange("upcoming")}
									className={`px-4 py-2 rounded-lg font-semibold transition-all ${filter === 'upcoming' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-text-dark hover:bg-gray-300'}`}
								>
									מתוכנן
								</button>
								<button
									onClick={() => handleFilterChange("completed")}
									className={`px-4 py-2 rounded-lg font-semibold transition-all ${filter === 'completed' ? 'bg-green-500 text-white' : 'bg-gray-200 text-text-dark hover:bg-gray-300'}`}
								>
									הושלם
								</button>
								<button
									onClick={() => handleFilterChange("cancelled")}
									className={`px-4 py-2 rounded-lg font-semibold transition-all ${filter === 'cancelled' ? 'bg-red-500 text-white' : 'bg-gray-200 text-text-dark hover:bg-gray-300'}`}
								>
									בוטל
								</button>
							</div>
						</div>
						{sessions.length > 0 ? (
							sessions.map((session, index) => (
								<div
									key={index}
									onClick={() => navigate(`/clients/${session.clientId._id}`)} className="bg-white rounded-xl shadow-md border border-trainer-primary/20 p-5 hover:shadow-lg hover:border-trainer-primary/30 transition-all"
								>
									{/* Header with client name and actions */}
									<div className="flex justify-between items-start mb-4 pb-3 border-b border-trainer-primary/10">
										<div className="flex items-center gap-2">
											<UserIcon className="w-6 h-6 text-trainer-primary" />
											<h3 className="text-xl font-bold text-trainer-dark">
												{session.clientId.firstName} {session.clientId.lastName}
											</h3>
										</div>
										<div className="flex gap-2 items-center">
											<SessionStatusBadge session={session} editable={true} onStatusChange={handleStatusChange} />
											<button
												onClick={(e) => {
													e.stopPropagation()
													setEditingSession(session)
												}}
												className="px-3 py-2 bg-trainer-primary hover:bg-trainer-dark text-white rounded-lg text-sm font-medium transition-all flex items-center gap-1.5"
											>
												<EditIcon className="w-4 h-4" /> עריכה
											</button>
										</div>
									</div>

									{/* Session Details */}
									<div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
										{/* Date */}
										<div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
											<CalendarIcon className="w-5 h-5 text-trainer-primary" />
											<div className="flex flex-col">
												<span className="text-xs text-text-medium">תאריך</span>
												<span className="text-sm font-semibold text-text-dark">
													{dayjs(session.startTime).format("DD/MM/YY")}
												</span>
											</div>
										</div>

										{/* Time */}
										<div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
											<ClockIcon className="w-5 h-5 text-trainer-primary" />
											<div className="flex flex-col">
												<span className="text-xs text-text-medium">שעה</span>
												<span className="text-sm font-semibold text-text-dark">
													{dayjs(session.startTime).format('HH:mm')} - {dayjs(session.endTime).format('HH:mm')}
												</span>
											</div>
										</div>

										{/* Session Type */}
										<div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
											<div className="flex flex-col">
												<span className="text-xs text-text-medium">סוג</span>
												<span className="text-sm font-semibold text-text-dark">
													{session.sessionType === 'Online' ? 'אונליין' : 'סטודיו'}
												</span>
											</div>
										</div>

										{/* Workout */}
										{session.workoutId || session.workoutName ? (
											<div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
												<div className="flex flex-col">
													<span className="text-xs text-text-medium">אימון</span>
													<span className="text-sm font-semibold text-text-dark">
														{typeof session.workoutId === 'object' && session.workoutId?.workoutName
															? session.workoutId.workoutName
															: session.workoutName || 'אימון מוגדר'}
													</span>
												</div>
											</div>
										) : (
											<div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg opacity-50">
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
					isLoading={sessionMutation.isPending}
				/>
			)}
		</div>
	)
}

export default SessionsPage
