import type { Request, Response } from "express";
import { getSessionsForClient } from "../helper/sessionHelper.js";
import { AppError } from "../../helper/errors.js";


export const getSessions = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id!;
        const filter = typeof req.query.filter === 'string' ? req.query.filter : '';
        const timeRange = typeof req.query.timeRange === 'string' ? req.query.timeRange : '';
        const specificDate = typeof req.query.specificDate === 'string' ? req.query.specificDate : '';

        const sessions = await getSessionsForClient(userId, filter, timeRange, specificDate);
        return res.status(200).json(sessions);
    } catch (error) {
        console.log(error);
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        res.status(500).json({ message: error instanceof Error ? error.message : String(error) });
    }
}
