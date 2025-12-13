import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router"
import EditWorkoutModal from "../components/client/EditWorkoutModal"
import NewWorkoutModal from "../components/client/NewWorkoutModal"
import {
	deleteWorkout,
	getClient,
	postWorkout,
	putWorkout,
} from "../services/api"
import type { Client, Workout } from "../types/clientTypes"

const ClientWorkoutsPage = () => {
	const { id } = useParams()
	const [client, setClient] = useState<Client | null>(null)
	const [workouts, setWorkouts] = useState<Workout[] | []>([])
	const [isAddOpen, setIsAddOpen] = useState<boolean>(false)
	const [isEditOpen, setIsEditOpen] = useState<boolean>(false)
	const currWorkout = useRef<Workout | null>(null)
	const navigate = useNavigate()

	useEffect(() => {
		const getClientData = async () => {
			try {
				if (id) {
					const response = await getClient(id)
					setClient(response.data.client)
					setWorkouts(response.data.workouts)
				}
			} catch (error) {
				console.error("Error fetching client:", error)
			}
		}

		getClientData()
	}, [id])

	const handleAddModalState = () => {
		setIsAddOpen(!isAddOpen)
	}

	const handleEditModalState = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
		workout: Workout,
	) => {
		e.stopPropagation()
		setIsEditOpen(!isEditOpen)
		currWorkout.current = workout
	}

	const handleAddWorkout = async (
		workoutData: Workout,
	): Promise<Workout | unknown> => {
		try {
			if (client?._id) {
				console.log(client._id, workoutData)
				const response = await postWorkout(client._id, workoutData)
				setWorkouts([...workouts, response.data])
				setIsAddOpen(false)
				return
			}
		} catch (error) {
			console.log(error)
			return error
		}
	}

	const handleEditWorkout = async (workoutData: Workout) => {
		try {
			if (client?._id && workoutData._id) {
				console.log(workoutData._id)
				const response = await putWorkout(
					client._id,
					workoutData,
					workoutData._id,
				)
				setWorkouts(
					workouts.map((workout) =>
						workout._id === response._id ? response : workout,
					),
				)
				setIsEditOpen(false)
			}
		} catch (error) {
			console.log(error)
			return error
		}
	}

	const handleDeleteWorkout = async (
		workoutId: string,
		e: React.MouseEvent<Element, MouseEvent>,
	) => {
		e.stopPropagation()
		try {
			console.log(workoutId)
			if (client?._id) {
				await deleteWorkout(client._id, workoutId)
				setWorkouts(workouts.filter((w) => w._id !== workoutId))
			}
		} catch (error) {
			console.error("Error deleting workout:", error)
		}
	}

	if (!client) {
		return <div>טוען...</div>
	}

	return (
		<div className="p-8 w-full flex flex-col items-center">
			<div className="max-w-lg w-full">
				<div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-6">
					<div className="flex justify-between items-center">
						<h1 className="text-3xl font-bold text-gray-800">אימונים</h1>
						<button
							onClick={handleAddModalState}
							className="px-4 py-2 shadow rounded bg-blue-500 hover:bg-blue-600 text-white transition-colors"
							type="button"
						>
							אימון חדש
						</button>
					</div>

					{isAddOpen && (
						<NewWorkoutModal
							onClose={() => setIsAddOpen(false)}
							onWorkoutSubmit={handleAddWorkout}
						/>
					)}

					{isEditOpen && (
						<EditWorkoutModal
							onClose={() => setIsEditOpen(false)}
							onWorkoutSubmit={handleEditWorkout}
							selectedWorkout={currWorkout.current}
						/>
					)}

					<div className="flex flex-col gap-4">
						{!workouts || workouts.length === 0 ? (
							<p className="text-center text-gray-500">אין אימונים עדיין</p>
						) : (
							workouts.map((workout) => (
								<div
									key={workout._id}
									className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
									onClick={() =>
										navigate(`/dashboard/clients/${id}/workouts/${workout._id}`)
									}
								>
									<div className="flex justify-between items-start mb-4">
										<div className="flex-1">
											{workout.notes && (
												<p className="text-gray-700 font-medium">{workout.notes}</p>
											)}
										</div>
										<div className="flex gap-2">
											<button
												onClick={(e) => handleEditModalState(e, workout)}
												className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
											>
												עריכה
											</button>
											<button
												onClick={(e) => handleDeleteWorkout(workout._id!, e)}
												className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
											>
												מחק
											</button>
										</div>
									</div>

									{workout.exercises && workout.exercises.length > 0 && (
										<div className="flex flex-col gap-3 mt-3">
											{workout.exercises.map((exercise) => (
												<div
													key={exercise._id}
													className="bg-white rounded-lg p-3 border border-gray-100"
												>
													<h3 className="font-semibold text-gray-800 mb-2">
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
											))}
										</div>
									)}
								</div>
							))
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default ClientWorkoutsPage
