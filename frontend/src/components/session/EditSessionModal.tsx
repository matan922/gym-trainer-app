import { useState, useEffect } from "react"
import type { Session, Workout } from "../../types/clientTypes"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { getClient } from "../../services/trainerApi"
import { EditIcon, UserIcon, MapPinIcon, MonitorIcon, CalendarIcon, ClockIcon, BarChartIcon, CheckIcon, XIcon } from "../icons/Icons"

interface EditSessionModalProps {
	session: Session
	onClose: () => void
	onSave: (sessionId: string, updatedData: Partial<Session>) => void
	isLoading?: boolean
}

function EditSessionModal({ session, onClose, onSave, isLoading }: EditSessionModalProps) {
	const [startTime, setStartTime] = useState<Date>(new Date(session.startTime))
	const [endTime, setEndTime] = useState<Date>(new Date(session.endTime))
	const [sessionType, setSessionType] = useState<string>(session.sessionType)
	const [status, setStatus] = useState<string>(session.status)
	const [workouts, setWorkouts] = useState<Workout[]>([])
	const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null)
	const [workoutName] = useState<string>(session.workoutName || "")

	// Fetch workouts for this client
	useEffect(() => {
		const fetchWorkouts = async () => {
			if (session.clientId._id) {
				try {
					const response = await getClient(session.clientId._id)
					setWorkouts(response.workouts || [])

					// Set initial workout if exists
					if (session.workoutId && typeof session.workoutId === 'object') {
						setSelectedWorkout(session.workoutId)
					}
				} catch (error) {
					console.log("Error fetching workouts:", error)
					setWorkouts([])
				}
			}
		}

		fetchWorkouts()
	}, [session.clientId._id, session.workoutId])

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (session._id) {
			onSave(session._id, {
				startTime,
				endTime,
				sessionType,
				status,
				workoutName: selectedWorkout?.workoutName || workoutName,
				workoutId: selectedWorkout?._id,
				clientId: {
					_id: session.clientId._id,
					firstName: session.clientId.firstName,
					lastName: session.clientId.lastName
				}
			})
		}
	}

	return (
		<>
			<div
				className="fixed inset-0 bg-black/50 z-40"
				onClick={onClose}
			/>

			<div className="fixed inset-0 flex items-center justify-center p-4 lg:p-8 z-50 pointer-events-none">
				<div className="bg-surface rounded-xl shadow-xl border border-trainer-primary/20 max-w-2xl w-full max-h-[90vh] overflow-auto pointer-events-auto">
					<div className="p-6 lg:p-8">
						{/* Header */}
						<div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-trainer-primary/20">
							<div className="flex items-center gap-3">
								<EditIcon className="w-8 h-8 text-trainer-primary" />
								<h2 className="text-3xl font-bold text-trainer-dark">עריכת אימון</h2>
							</div>
							<button
								onClick={onClose}
								type="button"
								className="text-text-medium hover:text-trainer-primary text-3xl font-bold transition-colors"
							>
								×
							</button>
						</div>

						{/* Client Info */}
						<div className="mb-6 p-4 bg-trainer-primary/10 rounded-lg border border-trainer-primary/20">
							<div className="flex items-center gap-2 text-right">
								<UserIcon className="w-5 h-5 text-trainer-primary" />
								<span className="text-sm text-text-medium">מתאמן:</span>
								<span className="text-lg font-bold text-trainer-dark">
									{session.clientId.firstName} {session.clientId.lastName}
								</span>
							</div>
						</div>

						<form className="flex flex-col gap-6" onSubmit={handleSubmit}>
							{/* Session Type */}
							<div>
								<label className="text-sm text-text-medium mb-2 text-right flex items-center gap-2">
									<MapPinIcon className="w-5 h-5 text-trainer-primary" />
									סוג אימון
								</label>
								<select
									value={sessionType}
									onChange={(e) => setSessionType(e.target.value)}
									className="w-full px-4 py-3 border border-trainer-primary/20 rounded-lg bg-white focus:ring-2 focus:ring-trainer-primary focus:border-trainer-primary outline-none transition-all text-right cursor-pointer"
								>
									<option value="Studio">סטודיו</option>
									<option value="Online">אונליין</option>
								</select>
							</div>

							{/* DateTime Fields */}
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
								<div>
									<label className="text-sm text-text-medium mb-2 text-right flex items-center gap-2">
										<CalendarIcon className="w-5 h-5 text-trainer-primary" />
										תאריך והתחלה
									</label>
									<DatePicker
										selected={startTime}
										onChange={(date) => date && setStartTime(date)}
										showTimeSelect
										timeIntervals={15}
										dateFormat="dd/MM/yyyy HH:mm"
										timeFormat="HH:mm"
										className="w-full px-4 py-3 border border-trainer-primary/20 rounded-lg bg-white focus:ring-2 focus:ring-trainer-primary focus:border-trainer-primary outline-none transition-all text-right"
										minDate={new Date()}
										withPortal
									/>
								</div>

								<div>
									<label className="text-sm text-text-medium mb-2 text-right flex items-center gap-2">
										<ClockIcon className="w-5 h-5 text-trainer-primary" />
										סיום
									</label>
									<DatePicker
										selected={endTime}
										onChange={(date) => date && setEndTime(date)}
										showTimeSelect
										timeIntervals={15}
										dateFormat="dd/MM/yyyy HH:mm"
										timeFormat="HH:mm"
										className="w-full px-4 py-3 border border-trainer-primary/20 rounded-lg bg-white focus:ring-2 focus:ring-trainer-primary focus:border-trainer-primary outline-none transition-all text-right"
										minDate={startTime}
										withPortal
									/>
								</div>
							</div>

							{/* Workout Selection */}
							{workouts.length > 0 && (
								<div>
									<label className="text-sm text-text-medium mb-2 text-right flex items-center gap-2">
										אימון (אופציונלי)
									</label>
									<select
										value={selectedWorkout?._id || ""}
										onChange={(e) => {
											const workout = workouts.find(w => w._id === e.target.value)
											setSelectedWorkout(workout || null)
										}}
										className="w-full px-4 py-3 border border-trainer-primary/20 rounded-lg bg-white focus:ring-2 focus:ring-trainer-primary focus:border-trainer-primary outline-none transition-all text-right cursor-pointer"
									>
										<option value="">ללא אימון מוגדר</option>
										{workouts.map((workout) => (
											<option key={workout._id} value={workout._id}>
												{workout.workoutName || `אימון - ${workout.exercises?.length || 0} תרגילים`}
											</option>
										))}
									</select>
								</div>
							)}

							{/* Status */}
							<div>
								<label className="text-sm text-text-medium mb-2 text-right flex items-center gap-2">
									<BarChartIcon className="w-5 h-5 text-trainer-primary" />
									סטטוס
								</label>
								<select
									value={status}
									onChange={(e) => setStatus(e.target.value)}
									className="w-full px-4 py-3 border border-trainer-primary/20 rounded-lg bg-white focus:ring-2 focus:ring-trainer-primary focus:border-trainer-primary outline-none transition-all text-right cursor-pointer"
								>
									<option value="Scheduled">מתוכנן</option>
									<option value="Completed">הושלם</option>
									<option value="Cancelled">בוטל</option>
								</select>
							</div>

							{/* Buttons */}
							<div className="flex gap-4 justify-center pt-4 border-t-2 border-trainer-primary/20">
								<button
									type="submit"
									disabled={isLoading}
									className="px-8 py-3 rounded-lg bg-trainer-primary hover:bg-trainer-dark text-white font-semibold shadow-md transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									<CheckIcon className="w-5 h-5" />
									{isLoading ? "שומר..." : "שמור"}
								</button>
								<button
									onClick={onClose}
									type="button"
									disabled={isLoading}
									className="px-8 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 text-text-dark font-semibold shadow-md transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									<XIcon className="w-5 h-5" />
									ביטול
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</>
	)
}

export default EditSessionModal
