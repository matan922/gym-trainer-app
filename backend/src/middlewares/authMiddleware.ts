import type { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'


export function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.status(401).json({success: false, message: "No authentication token"})

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err, payload) => {
        if (err) return res.status(403).json({success: false, message: "Invalid token"})
        req.user = payload as { id: string; activeProfile: 'trainer' | 'client'; iat?: number; exp?: number }
        next()
    })
}
