import React, { useState } from "react"
import type { Workout } from "../../types/clientTypes"
import reactDom from "react-dom"
import { getWorkout } from "../../services/api"

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
				className="fixed inset-0 bg-gradient-to-b from-gray-900 to-gray-800 opacity-50 z-50"
				onClick={onClose}
			/>

			<div className="fixed inset-0 flex items-center justify-center p-4 z-50 pointer-events-none">
				<div className="p-20 bg-white max-w-md w-full pointer-events-auto rounded-lg overflow-auto max-h-1/2">
					<form className="gap-4 flex flex-col" onSubmit={handleSubmit}>
						{workout.exercises.map((exercise, index) => {
							return (
								<div className="gap-4 flex flex-col" key={index}>
									<div className="flex justify-between">
										אימון {index + 1}
										<button
											onClick={() => handleDeleteExercise(index)}
											type="button"
											className="text-red-500"
										>
											X
										</button>
									</div>
									<label htmlFor="name">תרגיל</label>
									<input
										onChange={(e) => handleExercisesChange(e, index)}
										name="name"
										className="shadow bg-gray-300"
										type="text"
										value={exercise.name}
									/>

									<label htmlFor="sets">סטים</label>
									<input
										onChange={(e) => handleExercisesChange(e, index)}
										name="sets"
										value={exercise.sets === 0 ? "" : exercise.sets}
										className="shadow bg-gray-300"
										type="number"
									/>

									<label htmlFor="reps">חזרות</label>
									<input
										onChange={(e) => handleExercisesChange(e, index)}
										name="reps"
										value={exercise.reps === 0 ? "" : exercise.reps} 
										className="shadow bg-gray-300"
										type="number"
									/>

									<label htmlFor="rest">מנוחה</label>
									<input
										onChange={(e) => handleExercisesChange(e, index)}
										name="rest"
										value={exercise.rest === 0 ? "" : exercise.rest}
										className="shadow bg-gray-300"
										type="number"
									/>
								</div>
							)
						})}

						<label htmlFor="notes">הערות לאימון</label>
						<input
							onChange={handleWorkoutChange}
							name="notes"
							className="shadow bg-gray-300"
							type="text"
						/>

						<button
							onClick={handleAddExercise}
							className="bg-green-500"
							type="button"
						>
							הוספת תרגיל +
						</button>

						<button className="bg-green-500" type="submit">
							אישור
						</button>
					</form>
				</div>
			</div>
		</>,
		document.getElementById("portal")!,
	)
}

export default EditWorkoutModal
