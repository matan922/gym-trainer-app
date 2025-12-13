import React, { useState } from "react"
import type { Workout } from "../../types/clientTypes"
import reactDom from "react-dom"

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
		notes: selectedWorkout?.notes || "",
		exercises: selectedWorkout?.exercises || [],
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
				className="fixed inset-0 bg-gradient-to-b from-gray-900 to-gray-800 opacity-50 z-40"
				onClick={onClose}
			/>

			<div className="fixed inset-0 flex items-center justify-center p-8 z-50 pointer-events-none">
				<div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto pointer-events-auto">
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
							{workout.exercises.map((exercise, index) => (
								<div
									key={index}
									className="p-6 bg-gray-50 rounded-lg border border-gray-200"
								>
									<div className="flex justify-between items-center mb-4">
										<h3 className="text-xl font-semibold text-gray-800">
											תרגיל {index + 1}
										</h3>
										{workout.exercises.length > 1 && (
											<button
												onClick={() => handleDeleteExercise(index)}
												type="button"
												className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
											>
												מחק
											</button>
										)}
									</div>

									<div className="flex flex-col gap-4">
										<input
											onChange={(e) => handleExercisesChange(e, index)}
											name="name"
											placeholder="שם התרגיל"
											className="w-full shadow rounded-sm p-2 bg-gray-100 focus:bg-gray-300 outline-none"
											type="text"
											value={exercise.name}
										/>

										<div className="grid grid-cols-3 gap-4">
											<input
												onChange={(e) => handleExercisesChange(e, index)}
												name="sets"
												placeholder="סטים"
												value={exercise.sets === 0 ? "" : exercise.sets}
												className="w-full shadow rounded-sm p-2 bg-gray-100 focus:bg-gray-300 outline-none"
												type="number"
											/>

											<input
												onChange={(e) => handleExercisesChange(e, index)}
												name="reps"
												placeholder="חזרות"
												value={exercise.reps === 0 ? "" : exercise.reps}
												className="w-full shadow rounded-sm p-2 bg-gray-100 focus:bg-gray-300 outline-none"
												type="number"
											/>

											<input
												onChange={(e) => handleExercisesChange(e, index)}
												name="rest"
												placeholder="מנוחה (שניות)"
												value={exercise.rest === 0 ? "" : exercise.rest}
												className="w-full shadow rounded-sm p-2 bg-gray-100 focus:bg-gray-300 outline-none"
												type="number"
											/>
										</div>
									</div>
								</div>
							))}

							<button
								onClick={handleAddExercise}
								className="p-2 shadow rounded-sm bg-green-500 hover:bg-green-600 text-white transition-colors"
								type="button"
							>
								+ הוסף תרגיל
							</button>

							<input
								onChange={handleWorkoutChange}
								name="notes"
								placeholder="הערות לאימון"
								value={workout.notes}
								className="w-full shadow rounded-sm p-2 bg-gray-100 focus:bg-gray-300 outline-none"
								type="text"
							/>

							<div className="flex gap-4 justify-center pt-4">
								<button
									className="px-4 py-2 shadow rounded bg-blue-500 hover:bg-blue-600 text-white transition-colors"
									type="submit"
								>
									אישור
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
		</>,
		document.getElementById("portal")!,
	)
}

export default EditWorkoutModal
