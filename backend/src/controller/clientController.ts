import type { Request, Response } from "express";
import Client from "../models/Client.js";
import Workout from "../models/Workout.js";

// all clients
export const getClients = async (req: Request, res: Response) => {
    try {
        const user = req.user
        // Get clients with their last session if there is one
        const clients = await Client.aggregate([
            {
                $lookup: {
                    from: 'sessions',
                    localField: '_id',
                    foreignField: 'clientId',
                    as: 'sessions'
                }
            },
            {
                $addFields: {
                    lastSessionDate: {
                        $max: {
                            $map: {
                                input: {
                                    $filter: {
                                        input: '$sessions',
                                        cond: { $eq: ['$$this.status', 'Scheduled'] }
                                    }
                                },
                                in: '$$this.sessionDate'
                            }
                        }

                    }
                }
            },
            {
                $project: { sessions: 0 }
            }
        ])

        if (clients.length > 0) {
            return res.json(clients);
        }

        return res.json({ message: "No clients found" })
    } catch (error) {
        return res.status(500).json({ message: error instanceof Error ? error.message : String(error) });
    }
}

// 1 client
export const getClient = async (req: Request, res: Response) => {
    try {
        const user = req.user
        const { clientId } = req.params
        const client = await Client.findOne({ _id: clientId, trainerId: user?.id })

        if (!client) {
            return res.status(404).json({ message: "No client found" })
        }

        const workouts = await Workout.find({ clientId: clientId })
        res.status(200).json({ client, workouts })

    } catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : String(error) })
    }
}

// add new client
export const postClient = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, age, weight, goal, notes, } = req.body
        const user = req.user
        const newClient = new Client({ ...req.body, trainerId: user?.id }) // creates and saves 1 client with all data + trainerId
        const savedClient = await newClient.save()
        res.status(201).json(savedClient)
    } catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : String(error) });
    }
}

// update existing client data
export const putClient = async (req: Request, res: Response) => {
    try {
        const user = req.user
        const { clientId } = req.params
        const client = await Client.findOneAndUpdate({ _id: clientId, trainerId: user?.id }, req.body, { new: true, runValidators: true }
        );

        if (!client) {
            return res.status(404).json({ message: "Client not found" });
        }

        res.status(200).json({ client, success: true });
    } catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : String(error) });
    }
}

// delete a client
export const deleteClient = async (req: Request, res: Response) => {
    try {
        const user = req.user
        const { clientId } = req.params

        const client = await Client.findOneAndDelete({ _id: clientId, trainerId: user?.id })

        if (!client) {
            return res.status(404).json({ message: "Client not found or already deleted" })
        }

        res.status(200).json({ message: "Client deleted" })
    } catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : String(error) });
    }
}