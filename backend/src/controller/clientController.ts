import type { Request, Response } from "express";
import Client from "../models/Client";
import Workout from "../models/Workout";

// all clients
export const getClients = async (req: Request, res: Response) => {
    try {
        const user = req.user
        const clients = await Client.find({ trainerId: user?.id }); // returns a list of clients
        if (clients.length > 0) {
            return res.json(clients);
        }
        res.json({ message: "No clients found" })
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : String(error) });
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