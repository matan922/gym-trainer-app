import React, { useState } from "react"
import type { Workout } from "../../types/clientTypes"
import reactDom from "react-dom"
import { ClipBoardSolidIcon, EditIcon, TrashIcon, ClockIcon, PlusIcon } from "../icons/Icons"

const EditWorkoutModal = ({
	onClose,
	onWorkoutSubmit,
	selectedWorkout,
}: {
	onClose: () => void
	onWorkoutSubmit: (workoutData: Workout) => void
	selectedWorkout: Workout | null
}) => {
	const [workout, setWorkout] = useState<Workout>({
		_id: selectedWorkout?._id!,
		exercises: selectedWorkout?.exercises || [],
		workoutName: selectedWorkout?.workoutName || 'אימון'
	})
	const handleWorkoutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setWorkout({ ...workout, [name]: value })
	}

	const handleAddExercise = () => {
		const addExercise = [...workout.exercises]
		addExercise.push({ name: "", sets: 0, reps: 0, rest: 0 })
		setWorkout({ ...workout, exercises: addExercise })
	}

	const handleDeleteExercise = (index: number) => {
		setWorkout({
			...workout,
			exercises: workout.exercises.filter((_, i) => i !== index),
		})
	}

	const handleExercisesChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		index: number,
	) => {
		const { name, value } = e.target

		const updatedExercises = workout.exercises.map((exercise, i) => {
			if (i !== index) return exercise
			return {
				...exercise,
				[name]: name === "name" ? value : Number(value),
			}
		})

		setWorkout({ ...workout, exercises: updatedExercises })
	}

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		console.log("EDIT = ",workout)
		onWorkoutSubmit(workout)
	}

	return reactDom.createPortal(
		<>
			<div
				className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
				onClick={onClose}
			/>

			<div className="fixed inset-0 flex items-center justify-center p-4 lg:p-8 z-50 pointer-events-none">
				<div className="bg-surface rounded-xl shadow-2xl border border-trainer-primary/20 max-w-3xl w-full max-h-[90vh] overflow-auto pointer-events-auto">
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

						<form className="flex flex-col gap-6" onSubmit={handleSubmit}>
							{/* Workout Name */}
							<div>
								<label className="block text-sm text-text-medium mb-2 text-right flex items-center gap-2">
									<ClipBoardSolidIcon className="w-5 h-5 text-trainer-primary" />
									שם האימון
								</label>
								<input
									onChange={handleWorkoutChange}
									name="workoutName"
									placeholder="לדוגמה: אימון חזה וכתפיים"
									value={workout.workoutName}
									className="w-full px-4 py-3 border border-trainer-primary/20 rounded-lg bg-white focus:ring-2 focus:ring-trainer-primary focus:border-trainer-primary outline-none transition-all text-right"
									type="text"
								/>
							</div>

							{/* Exercises */}
							{workout.exercises.map((exercise, index) => (
								<div
									key={index}
									className="p-5 bg-white rounded-lg border border-trainer-primary/20 shadow-md"
								>
									<div className="flex justify-between items-center mb-4 pb-3 border-b border-trainer-primary/10">
										<h3 className="text-xl font-bold text-trainer-dark">
											תרגיל {index + 1}
										</h3>
										{workout.exercises.length > 1 && (
											<button
												onClick={() => handleDeleteExercise(index)}
												type="button"
												className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-medium transition-all flex items-center gap-1.5"
											>
												<TrashIcon className="w-4 h-4" /> מחק
											</button>
										)}
									</div>

									<div className="flex flex-col gap-4">
										<input
											onChange={(e) => handleExercisesChange(e, index)}
											name="name"
											placeholder="שם התרגיל"
											className="w-full px-4 py-3 border border-trainer-primary/20 rounded-lg bg-white focus:ring-2 focus:ring-trainer-primary focus:border-trainer-primary outline-none transition-all text-right"
											type="text"
											value={exercise.name}
										/>

										<div className="grid grid-cols-3 gap-3">
											<div>
												<label className="block text-sm text-text-medium mb-1 text-right">סטים</label>
												<input
													onChange={(e) => handleExercisesChange(e, index)}
													name="sets"
													placeholder="0"
													value={exercise.sets === 0 ? "" : exercise.sets}
													className="w-full px-3 py-2 border border-trainer-primary/20 rounded-lg bg-white focus:ring-2 focus:ring-trainer-primary focus:border-trainer-primary outline-none transition-all text-right"
													type="number"
												/>
											</div>

											<div>
												<label className="block text-sm text-text-medium mb-1 text-right">חזרות</label>
												<input
													onChange={(e) => handleExercisesChange(e, index)}
													name="reps"
													placeholder="0"
													value={exercise.reps === 0 ? "" : exercise.reps}
													className="w-full px-3 py-2 border border-trainer-primary/20 rounded-lg bg-white focus:ring-2 focus:ring-trainer-primary focus:border-trainer-primary outline-none transition-all text-right"
													type="number"
												/>
											</div>

											<div>
												<label className="block text-sm text-text-medium mb-1 text-right flex items-center gap-1 justify-end">
													<span>מנוחה (שניות)</span>
													<ClockIcon className="w-4 h-4" />
												</label>
												<input
													onChange={(e) => handleExercisesChange(e, index)}
													name="rest"
													placeholder="0"
													value={exercise.rest === 0 ? "" : exercise.rest}
													className="w-full px-3 py-2 border border-trainer-primary/20 rounded-lg bg-white focus:ring-2 focus:ring-trainer-primary focus:border-trainer-primary outline-none transition-all text-right"
													type="number"
												/>
											</div>
										</div>
									</div>
								</div>
							))}

							<button
								onClick={handleAddExercise}
								className="p-3 rounded-lg bg-trainer-primary hover:bg-trainer-dark text-white font-semibold shadow-md transition-all flex items-center justify-center gap-2"
								type="button"
							>
								<PlusIcon className="w-5 h-5" />
								הוסף תרגיל
							</button>

							{/* Action Buttons */}
							<div className="flex gap-3 justify-center pt-4 border-t-2 border-trainer-primary/20">
								<button
									className="px-6 py-3 rounded-lg bg-trainer-primary hover:bg-trainer-dark text-white font-semibold shadow-md transition-all"
									type="submit"
								>
									שמור שינויים
								</button>
								<button
									onClick={onClose}
									type="button"
									className="px-6 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 text-text-dark font-semibold transition-all"
								>
									ביטול
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</>,
		document.getElementById("portal")!,
	)
}

export default EditWorkoutModal
