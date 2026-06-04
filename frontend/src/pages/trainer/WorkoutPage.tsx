import { useState } from "react"
import { deleteWorkout, getWorkout, putWorkout } from "../../services/trainerApi"
import { useNavigate, useParams } from "react-router"
import type { Workout } from "../../types/clientTypes"
import EditWorkoutModal from "../../components/client/EditWorkoutModal"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { EditIcon, TrashIcon, ClockIcon } from "../../components/icons/Icons"
import BackButton from "../../components/general/BackButton"

const WorkoutPage = () => {
	const { id, workoutId } = useParams()
	const queryClient = useQueryClient()
	const [isEditOpen, setIsEditOpen] = useState(false)
	const navigate = useNavigate()

	const { data: workout, isPending, isError } = useQuery({
		queryKey: ['workout', id, workoutId],
		queryFn: () => getWorkout(id!, workoutId!),
		enabled: !!id && !!workoutId
	})

	const editWorkoutMutation = useMutation({
		mutationFn: ({ clientId, workoutData }: { clientId: string; workoutData: Workout }) =>
			putWorkout(clientId, workoutData, workoutData._id!),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['workout', id, workoutId] })
			queryClient.invalidateQueries({ queryKey: ['client', id] })
			setIsEditOpen(false)
		},
		onError: (error) => {
			console.error("Error editing workout:", error)
		}
	})

	const handleEditWorkout = (workoutData: Workout) => {
		if (id && workoutData._id) {
			editWorkoutMutation.mutate({ clientId: id, workoutData })
		}
	}

	const deleteWorkoutMutation = useMutation({
		mutationFn: ({ clientId, workoutId }: { clientId: string; workoutId: string }) =>
			deleteWorkout(clientId, workoutId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['client', id] })
			navigate(`/clients/${id}/workouts`)
		},
		onError: (error) => {
			console.error("Error deleting workout:", error)
		}
	})

	const handleDeleteWorkout = () => {
		if (id && workoutId) {
			deleteWorkoutMutation.mutate({ clientId: id, workoutId })
		}
	}

	if (isPending) return <div>טוען...</div>
	if (isError) return <div>שגיאה בטעינת אימון</div>
	if (!workout) return <div>אימון לא נמצא</div>

	return (
		<div className="min-h-screen bg-trainer p-4 lg:p-8">
			<div className="max-w-4xl mx-auto">
				<div className="bg-surface rounded-xl shadow-xl border border-trainer-primary/20 p-6 lg:p-8">
					<BackButton />
					{/* Header */}
					<div className="flex justify-between items-center gap-3 mb-6 pb-4 border-b-2 border-trainer-primary/20">
						<div className="flex items-center gap-3">
							<h1 className="text-3xl lg:text-4xl font-bold text-trainer-dark">{workout.workoutName}</h1>
						</div>
						<div className="flex gap-2">
							<button
								onClick={() => setIsEditOpen(true)}
								disabled={editWorkoutMutation.isPending || deleteWorkoutMutation.isPending}
								className="px-4 py-2 rounded-lg bg-trainer-primary hover:bg-trainer-dark text-white font-semibold shadow-md transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<EditIcon className="w-5 h-5" /> עריכה
							</button>
							<button
								onClick={handleDeleteWorkout}
								disabled={editWorkoutMutation.isPending || deleteWorkoutMutation.isPending}
								className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold shadow-md transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<TrashIcon className="w-5 h-5" /> {deleteWorkoutMutation.isPending ? "מוחק..." : "מחק"}
							</button>
						</div>
					</div>

					{/* Exercises Section */}
					<div className="flex flex-col gap-4">
						<div className="flex items-center gap-2 border-trainer-primary/20">
							<h2 className="text-2xl font-bold text-trainer-dark">תרגילים</h2>
							<span className="text-lg text-trainer-primary font-semibold">
								({workout?.exercises?.length || 0})
							</span>
						</div>

						{workout && workout.exercises.length > 0 ? (
							workout.exercises.map((exercise, index) => (
								<div
									key={index}
									className="p-4 bg-white rounded-lg border border-trainer-primary/20 shadow-md"
								>
									<h3 className="font-bold text-lg text-trainer-dark mb-3">
										{exercise.name}
									</h3>
									<div className="flex gap-4 text-sm text-text-medium">
										<span>{exercise.sets} סטים</span>
										<span>{exercise.reps} חזרות</span>
										{exercise.rest >= 60 ? (
											<span className="flex items-center gap-1"><ClockIcon className="w-4 h-4" /> {exercise.rest / 60} דקות מנוחה</span>
										) : (
											<span className="flex items-center gap-1"><ClockIcon className="w-4 h-4" /> {exercise.rest} שניות מנוחה</span>
										)}
									</div>
								</div>
							))
						) : (
							<div className="text-center py-12">
								<p className="text-text-light text-lg">אין תרגילים</p>
							</div>
						)}
					</div>
				</div>
			</div>

			{isEditOpen && workout && (
				<EditWorkoutModal
					onClose={() => setIsEditOpen(false)}
					onWorkoutSubmit={handleEditWorkout}
					selectedWorkout={workout}
					isLoading={editWorkoutMutation.isPending}
				/>
			)}
		</div>
	)
}

export default WorkoutPage
