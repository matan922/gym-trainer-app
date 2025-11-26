import { useEffect, useState } from "react"
import { getWorkout } from "../services/api"
import { useNavigate, useParams } from "react-router"
import type { Workout } from "../types/clientTypes"

const WorkoutPage = () => {
	const { id, workoutId } = useParams()
	const [workout, setWorkout] = useState<Workout>()
	const navigate = useNavigate()
	useEffect(() => {
		const getWorkoutData = async () => {
			try {
				if (id && workoutId) {
					const response = await getWorkout(id, workoutId)
					setWorkout(response)
				}
			} catch (error) {
				console.log("INTERCEPTOR!!! ", error)
			}
		}

		getWorkoutData()
	}, [id])

	return (
		<div>
			<div>
				{workout?.exercises?.map((res, index) => (
					<div key={index}>{res.name}</div>
				))}
			</div>
		</div>
	)
}

export default WorkoutPage
