import { useState } from "react"
import type { Exercise, Workout } from "../../types/clientTypes"
import reactDom from "react-dom"

const NewWorkoutModal = ({
	onClose,
	onWorkoutSubmit,
}: {
	onClose: () => void
	onWorkoutSubmit: (workoutData: Workout) => void
}) => {
	// const [exercises, setExercises] = useState<Exercise[]>([
	// 	{
	// 		name: "",
	// 		sets: 0,
	// 		reps: 0,
	// 		rest: 0,
	// 		_id: null,
	// 	},
	// ])
	// const [notes, setNotes] = useState("")

	// const addExercise = () => {
	// 	setExercises([
	// 		...exercises,
	// 		{ _id: null, name: "", sets: 0, reps: 0, rest: 0 },
	// 	])
	// }

	// const removeExercise = (index: number) => {
	// 	if (exercises.length > 1) {
	// 		setExercises(exercises.filter((_, i) => i !== index))
	// 	}
	// }

	// const updateExercise = (
	// 	index: number,
	// 	field: keyof Exercise,
	// 	value: string | number,
	// ) => {
	// 	const updated = [...exercises]
	// 	updated[index] = { ...updated[index], [field]: value }
	// 	setExercises(updated)
	// }

	// const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
	// 	e.preventDefault()
	// 	const workoutData: Workout = {
	// 		_id: null,
	// 		notes,
	// 		exercises,
	// 	}
	// 	onWorkoutSubmit(workoutData)
	// }

	const [workout, setWorkout] = useState<Workout>({
		notes: "",
		exercises: [],
	})

	const [exercises, setExercises] = useState<Exercise[]>([
		{
			name: "",
			sets: 0,
			reps: 0,
			rest: 0,
		},
	])

	const handleDeleteExercise = (index: number) => {
		setExercises(exercises.filter((value, i) => i !== index))
	}

	const handleAddExercise = () => {
		const addExercise = [...exercises]
		addExercise.push({
			name: "",
			sets: 0,
			reps: 0,
			rest: 0,
		})
		setExercises(addExercise)
	}

	const handleWorkoutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		console.log(name, value)
		setWorkout({ ...workout, [name]: value })
	}

	const handleExerciseChange = (
		index: number,
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		const { name, value } = e.target
		const updatedExercises = [...exercises]
		updatedExercises[index] = {
			...updatedExercises[index],
			[name]: name === "name" ? value : Number(value),
		}

		setExercises(updatedExercises)
	}

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const updatedWorkout = { ...workout, exercises: exercises }
		setWorkout(updatedWorkout)
		onWorkoutSubmit(updatedWorkout)
	}

	return reactDom.createPortal(
		<>
			<div
				className="fixed inset-0 bg-gradient-to-b from-gray-900 to-gray-800 opacity-50 z-50"
				onClick={onClose}
			/>

			<div className="fixed inset-0 flex items-center justify-center p-4 z-50 pointer-events-none">
				<div className="p-20 bg-white max-w-md w-full pointer-events-auto rounded-lg overflow-auto max-h-1/2">
					<form
						className="gap-4 flex flex-col"
						onSubmit={(e) => handleSubmit(e)}
					>
						{exercises.map((exercise, index) => {
							return (
								<div className="gap-4 flex flex-col" key={index}>
									<div className="flex justify-between">
										אימון {index + 1}
										<button
											onClick={() => handleDeleteExercise(index)}
											type="button"
											className="text-red-600 self-end"
										>
											X
										</button>
									</div>
									<label htmlFor="name">תרגיל</label>
									<input
										onChange={(e) => handleExerciseChange(index, e)}
										name="name"
										className="shadow bg-gray-300"
										type="text"
										value={exercise.name}
									/>

									<label htmlFor="sets">סטים</label>
									<input
										onChange={(e) => handleExerciseChange(index, e)}
										name="sets"
										value={exercise.sets === 0 ? "" : exercise.sets}
										className="shadow bg-gray-300"
										type="number"
									/>

									<label htmlFor="reps">חזרות</label>
									<input
										onChange={(e) => handleExerciseChange(index, e)}
										name="reps"
										value={exercise.reps === 0 ? "" : exercise.reps}
										className="shadow bg-gray-300"
										type="number"
									/>

									<label htmlFor="rest">מנוחה</label>
									<input
										onChange={(e) => handleExerciseChange(index, e)}
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
							הוסף תרגיל +
						</button>

						<button className="bg-green-500" type="submit">
							אישור
						</button>
					</form>
				</div>
			</div>
		</>,
		document.getElementById("portal")!,

		// <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
		// 	<div
		// 		className="fixed inset-0 bg-gradient-to-b from-gray-900 to-gray-800 opacity-50"
		// 		onClick={onClose}
		// 	/>
		// 	<div
		// 		className="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full relative z-10 max-h-[90vh] overflow-y-auto"
		// 		onClick={(e) => e.stopPropagation()}
		// 	>
		// 		<h2 className="text-2xl mb-6 text-center">אימון חדש</h2>
		// 		<form onSubmit={handleOnSubmit} className="flex flex-col gap-4">
		// 			{/* Exercise List */}
		// 			<div className="flex flex-col gap-4">
		// 				<h3 className="text-lg font-semibold">תרגילים</h3>
		// 				{exercises.map((exercise, index) => (
		// 					<div
		// 						key={index}
		// 						className="flex flex-col gap-2 p-4 bg-gray-50 rounded-lg relative"
		// 					>
		// 						<div className="flex justify-between items-center mb-2">
		// 							<span className="text-sm font-medium text-gray-600">
		// 								תרגיל {index + 1}
		// 							</span>
		// 							{exercises.length > 1 && (
		// 								<button
		// 									type="button"
		// 									onClick={() => removeExercise(index)}
		// 									className="text-red-500 hover:text-red-700 font-bold text-xl"
		// 								>
		// 									×
		// 								</button>
		// 							)}
		// 						</div>

		// 						<input
		// 							value={exercise.name}
		// 							onChange={(e) =>
		// 								updateExercise(index, "name", e.target.value)
		// 							}
		// 							className="w-full p-2 shadow rounded-sm bg-white focus:bg-gray-100 outline-none"
		// 							placeholder="שם התרגיל"
		// 							type="text"
		// 							required
		// 						/>

		// 						<div className="grid grid-cols-3 gap-2">
		// 							<input
		// 								value={exercise.sets || ""}
		// 								onChange={(e) =>
		// 									updateExercise(index, "sets", Number(e.target.value))
		// 								}
		// 								className="w-full p-2 shadow rounded-sm bg-white focus:bg-gray-100 outline-none"
		// 								placeholder="סטים"
		// 								type="number"
		// 								required
		// 							/>
		// 							<input
		// 								value={exercise.reps || ""}
		// 								onChange={(e) =>
		// 									updateExercise(index, "reps", Number(e.target.value))
		// 								}
		// 								className="w-full p-2 shadow rounded-sm bg-white focus:bg-gray-100 outline-none"
		// 								placeholder="חזרות"
		// 								type="number"
		// 								required
		// 							/>
		// 							<input
		// 								value={exercise.rest || ""}
		// 								onChange={(e) =>
		// 									updateExercise(index, "rest", Number(e.target.value))
		// 								}
		// 								className="w-full p-2 shadow rounded-sm bg-white focus:bg-gray-100 outline-none"
		// 								placeholder="מנוחה (שניות)"
		// 								type="number"
		// 								required
		// 							/>
		// 						</div>
		// 					</div>
		// 				))}

		// 				<button
		// 					type="button"
		// 					onClick={addExercise}
		// 					className="p-2 shadow rounded-sm bg-green-500 text-white hover:bg-green-600"
		// 				>
		// 					+ הוסף תרגיל
		// 				</button>
		// 			</div>

		// 			{/* Notes */}
		// 			<textarea
		// 				value={notes}
		// 				onChange={(e) => setNotes(e.target.value)}
		// 				placeholder="הערות לאימון"
		// 				className="w-full p-2 shadow rounded-sm bg-gray-100 focus:bg-gray-300 outline-none"
		// 				rows={3}
		// 			/>

		// 			{/* Action Buttons */}
		// 			<div className="flex gap-4 justify-center">
		// 				<button
		// 					type="submit"
		// 					className="p-2 px-6 shadow rounded-sm bg-blue-500 text-white hover:bg-blue-600"
		// 				>
		// 					אישור
		// 				</button>
		// 				<button
		// 					type="button"
		// 					onClick={onClose}
		// 					className="p-2 px-6 shadow rounded-sm bg-gray-100 hover:bg-gray-200"
		// 				>
		// 					ביטול
		// 				</button>
		// 			</div>
		// 		</form>
		// 	</div>
		// </div>
	)
}

export default NewWorkoutModal
