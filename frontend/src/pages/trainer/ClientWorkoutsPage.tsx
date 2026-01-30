import { useRef, useState } from "react"
import { useNavigate, useParams } from "react-router"
import EditWorkoutModal from "../../components/client/EditWorkoutModal"
import NewWorkoutModal from "../../components/client/NewWorkoutModal"
import {
	deleteWorkout,
	getClient,
	postWorkout,
	putWorkout,
} from "../../services/trainerApi"
import type { Workout } from "../../types/clientTypes"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

const ClientWorkoutsPage = () => {
	const { id } = useParams()
	const queryClient = useQueryClient()
	const [isAddOpen, setIsAddOpen] = useState<boolean>(false)
	const [isEditOpen, setIsEditOpen] = useState<boolean>(false)
	const currWorkout = useRef<Workout | null>(null)
	const navigate = useNavigate()

	const { data: clientData, isPending, isError } = useQuery({
		queryKey: ['client', id],
		queryFn: () => getClient(id!),
		enabled: !!id
	})

	const client = clientData?.client
	const workouts = clientData?.workouts || []

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

	const addWorkoutMutation = useMutation({
		mutationFn: ({ clientId, workoutData }: { clientId: string; workoutData: Workout }) => postWorkout(clientId, workoutData),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['client', id] })
			setIsAddOpen(false)
		},
		onError: (error) => {
			console.error("Error adding workout:", error)
		}
	})

	const handleAddWorkout = (workoutData: Workout) => {
		if (client?._id) {
			addWorkoutMutation.mutate({ clientId: client._id, workoutData })
		}
	}

	const editWorkoutMutation = useMutation({
		mutationFn: ({ clientId, workoutData, workoutId }: { clientId: string; workoutData: Workout; workoutId: string; }) =>
			putWorkout(clientId, workoutData, workoutId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['client', id] })
			setIsEditOpen(false)
		},
		onError: (error) => {
			console.error("Error editing workout:", error)
		}
	})

	const handleEditWorkout = (workoutData: Workout) => {
		if (client?._id && workoutData._id) {

			editWorkoutMutation.mutate({ clientId: client._id, workoutData, workoutId: workoutData._id })
		}
	}

	const deleteWorkoutMutation = useMutation({
		mutationFn: ({ clientId, workoutId }: { clientId: string; workoutId: string; }) => deleteWorkout(clientId, workoutId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['client', id] })
		},
		onError: (error) => {
			console.error("Error deleting workout:", error)
		}
	})

	const handleDeleteWorkout = (
		workoutId: string,
		e: React.MouseEvent<Element, MouseEvent>,
	) => {
		e.stopPropagation()
		if (client?._id) {
			deleteWorkoutMutation.mutate({ clientId: client._id, workoutId })
		}
	}

	if (isPending) return <div>טוען...</div>
	if (isError) return <div>שגיאה בטעינת נתונים</div>
	if (!client) return <div>לקוח לא נמצא</div>

	return (
		<div className="min-h-screen bg-trainer p-4 lg:p-8">
			<div className="max-w-4xl mx-auto">
				<div className="bg-surface rounded-xl shadow-xl border border-trainer-primary/20 p-6 lg:p-8">
					{/* Header */}
					<div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 pb-4 border-b-2 border-trainer-primary/20">
						<div className="flex  items-center gap-3">
							<span className="text-2xl">💪</span>
							<h1 className="text-3xl lg:text-4xl font-bold text-trainer-dark">אימונים</h1>
							<span className="text-lg text-trainer-primary font-semibold">
								({workouts.length})
							</span>
						</div>
						<button
							onClick={handleAddModalState}
							className="px-4 py-2 rounded-lg bg-trainer-primary hover:bg-trainer-dark text-white font-semibold shadow-md transition-all flex items-center gap-2"
							type="button"
						>
							<span>➕</span>
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

					{/* Workouts List */}
					<div className="flex flex-col gap-4">
						{!workouts || workouts.length === 0 ? (
							<div className="text-center py-12">
								<p className="text-text-light text-lg">אין אימונים עדיין</p>
							</div>
						) : (
							workouts.map((workout) => (
								<div
									key={workout._id}
									className="bg-white rounded-xl shadow-md border border-trainer-primary/20 p-5 hover:shadow-lg hover:border-trainer-primary/30 transition-all cursor-pointer"
									onClick={() =>
										navigate(`/clients/${id}/workouts/${workout._id}`)
									}
								>
									<div className="flex justify-between items-start mb-4">
										<div className="flex-1">
											{workout.workoutName && (
												<div className="flex items-center gap-2 mb-3">
													<span className="text-xl">📝</span>
													<p className="text-text-dark font-semibold">{workout.workoutName}</p>
												</div>
											)}
										</div>
										<div className="flex gap-2">
											<button
												onClick={(e) => handleEditModalState(e, workout)}
												className="px-3 py-1 bg-trainer-primary text-white rounded-lg hover:bg-trainer-dark text-sm font-medium transition-all"
											>
												✏️ עריכה
											</button>
											<button
												onClick={(e) => handleDeleteWorkout(workout._id!, e)}
												className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-medium transition-all"
											>
												🗑️ מחק
											</button>
										</div>
									</div>

									{workout.exercises && workout.exercises.length > 0 && (
										<div className="flex flex-col gap-2">
											{workout.exercises.map((exercise, index) => (
												<div
													key={exercise._id || index}
													className="bg-gray-50 rounded-lg p-3 border-r-4 border-trainer-primary"
												>
													<h3 className="font-bold text-trainer-dark mb-2 flex items-center gap-2">
														<span className="text-lg">🏋️</span>
														{exercise.name}
													</h3>
													<div className="flex gap-4 text-sm text-text-medium mr-7">
														<span>🔢 {exercise.sets} סטים</span>
														<span>🔁 {exercise.reps} חזרות</span>
														{exercise.rest >= 60 ? (
															<span>⏱️ {exercise.rest / 60} דקות מנוחה</span>
														) : (
															<span>⏱️ {exercise.rest} שניות מנוחה</span>
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
