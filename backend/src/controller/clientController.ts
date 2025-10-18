import type { Request, Response } from "express";
import Client from "../models/Client";

// all clients
export const getClients = async (req: Request, res: Response) => {
    try {
        const clients = await Client.find(); // returns a list of clients
        if (clients.length > 0) {
            return res.json(clients);
        }
        res.json({ message: "No clients" })
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : String(error) });
    }
}

// 1 client
export const getClient = async (req: Request, res: Response) => {
    try {
        const client = await Client.findById(req.params.id) // returns 1 client
        if (client) {
            return res.status(200).json(client)
        }
        res.status(404).json({ message: "No client found" })


    } catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : String(error) })
    }
}

// add new client
export const postClient = async (req: Request, res: Response) => {
    try {
        // creates and saves 1 client
        const newClient = new Client(req.body)
        const savedClient = await newClient.save()
        res.status(201).json(savedClient)
    } catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : String(error) });
    }
}

// update existing client data
export const putClient = async (req: Request, res: Response) => {
    try {
        const client = await Client.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!client) {
            return res.status(404).json({ message: "Client not found" });
        }

        res.status(200).json(client);
    } catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : String(error) });
    }
}

// delete a client
export const deleteClient = async (req: Request, res: Response) => {
    try {
        const client = await Client.findByIdAndDelete(req.params.id)

        if (!client) {
            return res.status(404).json({message: "Client not found or already deleted"})
        }

        res.status(200).json({message: "Client deleted"})
    } catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : String(error) });
    }
}