import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router"
import {
	fetchClient,
	postWorkout,
	deleteWorkout,
	putWorkout,
} from "../services/api"
import type { Client, Workout } from "../types/clientTypes"
import NewWorkoutModal from "../components/client/NewWorkoutModal"
import EditWorkoutModal from "../components/client/EditWorkoutModal"

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
					const response = await fetchClient(id)
					setClient(response.data.client)
					setWorkouts(response.data.workouts)
				}
			} catch (error) {
				console.error("Error fetching client:", error)
				navigate("/")
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
				console.log(response)
				setWorkouts([...workouts, response])
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
		<div>
			<div className="flex flex-col items-center">
				<div className="flex flex-col gap-8 w-full max-w-lg">
					<h1 className="text-2xl text-center">אימונים</h1>
					<div className="flex justify-center">
						<button
							onClick={handleAddModalState}
							className="p-2 shadow rounded-sm bg-blue-500 text-white"
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

					{!workouts || workouts.length === 0 ? (
						<div className="text-center text-gray-500 py-8">
							<p>אין אימונים עדיין</p>
						</div>
					) : (
						workouts.map((workout) => (
							<div
								key={workout._id}
								className="shadow rounded-lg p-6 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
								onClick={() =>
									navigate(`/dashboard/clients/${id}/workouts/${workout._id}`)
								}
							>
								<div className="flex justify-between items-start mb-4">
									<div>
										{/* {workout.date && (
											<p className="text-sm text-gray-600 mb-2">
												{new Date(workout.date).toLocaleDateString('he-IL')}
											</p>
										)} */}
										{workout.notes && (
											<p className="text-gray-700">{workout.notes}</p>
										)}
									</div>
									<button
										onClick={(e) => handleDeleteWorkout(workout._id!, e)}
										className="px-3 py-1 bg-red-500 text-white rounded-sm hover:bg-red-600 text-sm flex-shrink-0"
									>
										מחק
									</button>
								</div>

								<div className="flex flex-col gap-4">
									{workout.exercises?.map((exercise) => {
										return (
											<div
												key={exercise._id}
												className="shadow rounded-lg p-4 bg-white"
											>
												<h3 className="font-semibold text-lg mb-2">
													{exercise.name}
												</h3>
												<div className="flex gap-8 text-sm text-gray-600">
													<span>סטים: {exercise.sets}</span>
													<span>חזרות: {exercise.reps}</span>
													{exercise.rest >= 60 ? (
														<span>מנוחה: {exercise.rest / 60} דקות</span>
													) : (
														<span>מנוחה: {exercise.rest} שניות</span>
													)}
												</div>
											</div>
										)
									})}
									<button
										onClick={(e) => handleEditModalState(e, workout)}
										className="p-2 bg-green-500 text-white rounded-sm hover:bg-green-600 text-sm w-fit"
									>
										עריכה
									</button>
								</div>
							</div>
						))
					)}
				</div>
			</div>
		</div>
	)
}

export default ClientWorkoutsPage
