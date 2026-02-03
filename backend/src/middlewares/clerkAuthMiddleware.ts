import { clerkMiddleware, getAuth } from '@clerk/express'
import type { Request, Response, NextFunction } from 'express'

// Export Clerk's base middleware (verifies JWT tokens)
export const verifyClerkToken = clerkMiddleware({ secretKey: process.env.CLERK_SECRET_KEY! })

// Custom middleware to require authentication
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    const { userId } = getAuth(req)

    if (!userId) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized - No valid Clerk session"
        })
    }

    // Attach clerkId to request for easy access in controllers
    req.clerkId = userId
    next()
}
