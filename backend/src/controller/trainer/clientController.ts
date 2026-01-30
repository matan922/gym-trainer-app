import type { Request, Response } from "express";
import User from "../../models/user/User.js";
import Workout from "../../models/Workout.js";
import TrainerClientRelation from "../../models/TrainerClientRelation.js";
import Session from "../../models/Session.js";

// all clients
export const getClients = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        const relations = await TrainerClientRelation.find({
            trainerId: user?.id,
            status: 'active'
        });

        if (relations.length === 0) {
            return res.json({ message: "No clients found" });
        }

        const clientIdArray = relations.map((relation) => relation.clientId);
        const clientUsers = await User.find({ _id: { $in: clientIdArray }, 'profiles.client': { $exists: true } })
        const completedSessions = await Session.find({ trainerId: user?.id, clientId: { $in: clientIdArray }, status: 'Completed' }).sort({ startTime: -1 })

        const clientsData = clientUsers.map(user => {
            const lastSession = completedSessions.find(session => session.clientId.toString() === user._id.toString())

            return {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                age: user.profiles.client?.age,
                weight: user.profiles.client?.weight,
                goal: user.profiles.client?.goal,
                notes: user.profiles.client?.notes,
                lastSessionDate: lastSession?.startTime || null
            }
        })

        return res.json(clientsData)
    } catch (error) {
        return res.status(500).json({
            message: error instanceof Error ? error.message : String(error)
        });
    }
}

// 1 client
export const getClient = async (req: Request, res: Response) => {
    try {
        const user = req.user
        const { clientId } = req.params
        const relation = await TrainerClientRelation.findOne({ trainerId: user?.id, clientId: clientId, status: 'active' })
        if (!relation) {
            return res.status(403).json({ message: 'Not authorized' })
        }

        const relatedClient = await User.findOne({ _id: clientId, 'profiles.client': { $exists: true } })
        if (!relatedClient) {
            return res.status(404).json({ message: 'Client not found' })
        }

        // Flatten the client data structure for frontend
        const clientData = {
            _id: relatedClient._id,
            firstName: relatedClient.firstName,
            lastName: relatedClient.lastName,
            age: relatedClient.profiles.client?.age,
            weight: relatedClient.profiles.client?.weight,
            goal: relatedClient.profiles.client?.goal,
            notes: relatedClient.profiles.client?.notes
        }

        const relatedWorkouts = await Workout.find({ trainerId: user?.id, clientId: clientId })
        return res.status(200).json({ client: clientData, workouts: relatedWorkouts })
    } catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : String(error) })
    }
}


// TODO: trainer shouldnt edit their client's personal data but they should be able to update notes about said client
// add trainerNotes to relationship model


// end a client relation for current trainer
export const endRelation = async (req: Request, res: Response) => {
    try {
        const user = req.user
        const { clientId } = req.params

        const relation = await TrainerClientRelation.findOne({
            trainerId: user?.id,
            clientId: clientId
        });
        if (!relation) {
            return res.status(404).json({ message: 'Relationship not found' });
        }

        if (relation.status !== 'active') {
            return res.status(400).json({ message: 'Relationship already ended' });
        }

        relation.status = 'ended';
        relation.endedAt = new Date();
        await relation.save();
        res.status(200).json({ message: "Client removed" })
    } catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : String(error) });
    }
}