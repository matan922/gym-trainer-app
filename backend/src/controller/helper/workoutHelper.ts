import TrainerClientRelation from "../../models/TrainerClientRelation.js";
import Workout from "../../models/Workout.js";
import { ForbiddenError } from "../../helper/errors.js";


export const getWorkoutsForClient = async (userId: string, trainerId: string) => {
    const relation = await TrainerClientRelation.findOne({ trainerId: trainerId, clientId: userId, status: "active" })
    if (!relation) {
        throw new ForbiddenError("No relation between you and the client")
    }

    const workouts = await Workout.find({ clientId: userId, trainerId: trainerId }) // in case of 0 workouts empty array is returned []
    return workouts
}

export const getWorkoutsForTrainer = async (userId: string, clientId: string) => {
    const relation = await TrainerClientRelation.findOne({ trainerId: userId, clientId: clientId, status: "active" })
    if (!relation) {
        throw new ForbiddenError("No relation between you and the client")
    }

    const workouts = await Workout.find({ clientId: clientId, trainerId: userId }) // in case of 0 workouts empty array is returned []
    return workouts
}