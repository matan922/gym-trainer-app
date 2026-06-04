import { useState } from "react"
import type { Exercise, Workout } from "../../types/clientTypes"
import reactDom from "react-dom"
import { ClipBoardSolidIcon, PlusIcon, TrashIcon, ClockIcon } from "../icons/Icons"

const NewWorkoutModal = ({
	onClose,
	onWorkoutSubmit,
	isLoading,
}: {
	onClose: () => void
	onWorkoutSubmit: (workoutData: Workout) => void
	isLoading?: boolean
}) => {

	const [workout, setWorkout] = useState<Workout>({
		workoutName: "",
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
		setExercises(exercises.filter((_, i) => i !== index))
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
				className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
				onClick={onClose}
			/>

			<div className="fixed inset-0 flex items-center justify-center p-4 lg:p-8 z-50 pointer-events-none">
				<div className="bg-surface rounded-xl shadow-2xl border border-trainer-primary/20 max-w-3xl w-full max-h-[90vh] overflow-auto pointer-events-auto">
					<div className="p-6 lg:p-8">
						{/* Header */}
						<div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-trainer-primary/20">
							<div className="flex ">
								<h2 className="text-3xl font-bold text-trainer-dark">אימון חדש</h2>
							</div>
							<button
								onClick={onClose}
								type="button"
								className="text-text-medium hover:text-trainer-primary text-3xl font-bold transition-colors"
							>
								×
							</button>
						</div>

						<form className="flex flex-col gap-6" onSubmit={(e) => handleSubmit(e)}>
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
							{exercises.map((exercise, index) => (
								<div
									key={index}
									className="p-5 bg-white rounded-lg border border-trainer-primary/20 shadow-md"
								>
									<div className="flex justify-between items-center mb-4 pb-3 border-b border-trainer-primary/10">
										<h3 className="text-xl font-bold text-trainer-dark">
											תרגיל {index + 1}
										</h3>
										{exercises.length > 1 && (
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
											onChange={(e) => handleExerciseChange(index, e)}
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
													onChange={(e) => handleExerciseChange(index, e)}
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
													onChange={(e) => handleExerciseChange(index, e)}
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
													onChange={(e) => handleExerciseChange(index, e)}
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
									className="px-6 py-3 rounded-lg bg-trainer-primary hover:bg-trainer-dark text-white font-semibold shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
									type="submit"
									disabled={isLoading}
								>
									{isLoading ? "יוצר..." : "צור אימון"}
								</button>
								<button
									onClick={onClose}
									type="button"
									disabled={isLoading}
									className="px-6 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 text-text-dark font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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

export default NewWorkoutModal
