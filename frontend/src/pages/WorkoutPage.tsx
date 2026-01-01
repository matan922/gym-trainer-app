import { useEffect, useState } from "react"
import { deleteWorkout, getWorkout, putWorkout } from "../services/api"
import { useNavigate, useParams } from "react-router"
import type { Workout } from "../types/clientTypes"
import EditWorkoutModal from "../components/client/EditWorkoutModal"

const WorkoutPage = () => {
	const { id, workoutId } = useParams()
	const [workout, setWorkout] = useState<Workout>()
	const [isEditOpen, setIsEditOpen] = useState(false)
	const navigate = useNavigate()

	useEffect(() => {
		const getWorkoutData = async () => {
			try {
				if (id && workoutId) {
					const response = await getWorkout(id, workoutId)
					setWorkout(response)
				}
			} catch (error) {
				console.log(error)
			}
		}

		getWorkoutData()
	}, [id, workoutId])

	const handleEditWorkout = async (workoutData: Workout) => {
		try {
			if (id && workoutData._id) {
				const response = await putWorkout(id, workoutData, workoutData._id)
				setWorkout(response)
				setIsEditOpen(false)
			}
		} catch (error) {
			console.log(error)
		}
	}

	const handleDeleteWorkout = async () => {
		try {
			if (id && workoutId) {
				await deleteWorkout(id, workoutId)
				navigate(`/dashboard/clients/${id}/workouts`)
			}
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<div className="p-8 w-full flex flex-col items-center">
			<div className="max-w-lg w-full">
				<div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-6">
					<div className="flex justify-between items-center">
						<h1 className="text-3xl font-bold text-gray-800">פרטי אימון</h1>
						<div className="flex gap-2">
							<button
								onClick={() => setIsEditOpen(true)}
								className="px-4 py-2 rounded shadow bg-green-500 hover:bg-green-600 text-white transition-colors"
							>
								עריכה
							</button>
							<button
								onClick={handleDeleteWorkout}
								className="px-4 py-2 rounded shadow bg-red-500 hover:bg-red-600 text-white transition-colors"
							>
								מחק
							</button>
						</div>
					</div>

					{workout?.notes && (
						<div className="flex flex-col gap-1">
							<span className="font-semibold text-gray-700">הערות:</span>
							<span className="text-gray-600">{workout.notes}</span>
						</div>
					)}

					<div className="flex flex-col gap-4">
						<h2 className="text-xl font-semibold text-gray-800">תרגילים</h2>
						{workout?.exercises && workout.exercises.length > 0 ? (
							workout.exercises.map((exercise, index) => (
								<div
									key={index}
									className="p-4 bg-gray-50 rounded-lg border border-gray-200"
								>
									<h3 className="font-semibold text-lg text-gray-800 mb-2">
										{exercise.name}
									</h3>
									<div className="flex gap-6 text-sm text-gray-600">
										<span>סטים: {exercise.sets}</span>
										<span>חזרות: {exercise.reps}</span>
										{exercise.rest >= 60 ? (
											<span>מנוחה: {exercise.rest / 60} דקות</span>
										) : (
											<span>מנוחה: {exercise.rest} שניות</span>
										)}
									</div>
								</div>
							))
						) : (
							<p className="text-center text-gray-500">אין תרגילים</p>
						)}
					</div>
				</div>
			</div>

			{isEditOpen && workout && (
				<EditWorkoutModal
					onClose={() => setIsEditOpen(false)}
					onWorkoutSubmit={handleEditWorkout}
					selectedWorkout={workout}
				/>
			)}
		</div>
	)
}

export default WorkoutPage
