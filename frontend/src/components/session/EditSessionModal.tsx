import { useState } from "react"
import type { Session } from "../../types/clientTypes"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

interface EditSessionModalProps {
	session: Session
	onClose: () => void
	onSave: (sessionId: string, updatedData: Partial<Session>) => void
}

function EditSessionModal({ session, onClose, onSave }: EditSessionModalProps) {
	const [sessionDate, setSessionDate] = useState<Date>(new Date(session.sessionDate))
	const [startTime, setStartTime] = useState<Date>(new Date(session.startTime))
	const [endTime, setEndTime] = useState<Date>(new Date(session.endTime))
	const [sessionType, setSessionType] = useState<string>(session.sessionType)

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (session._id) {
			onSave(session._id, {
				sessionDate,
				startTime,
				endTime,
				sessionType
			})
		}
	}

	return (
		<>
			<div
				className="fixed inset-0 bg-gradient-to-b from-gray-900 to-gray-800 opacity-50 z-40"
				onClick={onClose}
			/>

			<div className="fixed inset-0 flex items-center justify-center p-8 z-50 pointer-events-none">
				<div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-auto pointer-events-auto">
					<div className="p-8">
						<div className="flex justify-between items-center mb-6">
							<h2 className="text-3xl font-bold text-gray-800">עריכת אימון</h2>
							<button
								onClick={onClose}
								type="button"
								className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
							>
								×
							</button>
						</div>

						<form className="flex flex-col gap-6" onSubmit={handleSubmit}>
							<div className="flex flex-col gap-2">
								<label className="text-sm font-semibold text-gray-700">תאריך</label>
								<DatePicker
									selected={sessionDate}
									onChange={(date) => date && setSessionDate(date)}
									dateFormat="dd/MM/yyyy"
									className="w-full shadow rounded-sm p-2 bg-gray-100 focus:bg-gray-300 outline-none"
									minDate={new Date()}
								/>
							</div>

							<div className="flex flex-col gap-2">
								<label className="text-sm font-semibold text-gray-700">שעת התחלה</label>
								<DatePicker
									selected={startTime}
									onChange={(date) => date && setStartTime(date)}
									showTimeSelect
									showTimeSelectOnly
									timeIntervals={15}
									dateFormat="HH:mm"
									timeFormat="HH:mm"
									className="w-full shadow rounded-sm p-2 bg-gray-100 focus:bg-gray-300 outline-none"
								/>
							</div>

							<div className="flex flex-col gap-2">
								<label className="text-sm font-semibold text-gray-700">שעת סיום</label>
								<DatePicker
									selected={endTime}
									onChange={(date) => date && setEndTime(date)}
									showTimeSelect
									showTimeSelectOnly
									timeIntervals={15}
									dateFormat="HH:mm"
									timeFormat="HH:mm"
									className="w-full shadow rounded-sm p-2 bg-gray-100 focus:bg-gray-300 outline-none"
								/>
							</div>

							<div className="flex flex-col gap-2">
								<label className="text-sm font-semibold text-gray-700">סוג אימון</label>
								<select
									value={sessionType}
									onChange={(e) => setSessionType(e.target.value)}
									className="w-full shadow rounded-sm p-2 bg-gray-100 focus:bg-gray-300 outline-none"
								>
									<option value="Studio">סטודיו</option>
									<option value="Online">אונליין</option>
								</select>
							</div>

							<div className="flex gap-4 justify-center pt-4">
								<button
									type="submit"
									className="px-4 py-2 shadow rounded bg-blue-500 hover:bg-blue-600 text-white transition-colors"
								>
									שמור
								</button>
								<button
									onClick={onClose}
									type="button"
									className="px-4 py-2 shadow rounded bg-gray-100 hover:bg-gray-200 transition-colors"
								>
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
