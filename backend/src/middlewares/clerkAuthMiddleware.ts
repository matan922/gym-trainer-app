import { clerkMiddleware, getAuth, clerkClient } from '@clerk/express'
import type { Request, Response, NextFunction } from 'express'

// Export Clerk's base middleware (verifies JWT tokens)
export const verifyClerkToken = clerkMiddleware({ secretKey: process.env.CLERK_SECRET_KEY! })

// Custom middleware to require authentication
export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = getAuth(req)
    const authHeader = req.headers.authorization
    console.log(req.headers.authorization)
    console.log(userId)

    // only accept bearer token
    if (!authHeader) {
        console.log("no bearer token")
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        })
    }

    if (!userId) {
        console.log("failed in middleware")
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        })
    }

    try {
        // Fetch user from Clerk to get publicMetadata
        const clerkUser = await clerkClient.users.getUser(userId)
        const { activeProfile, mongoUserId } = clerkUser.publicMetadata as {
            activeProfile: 'client' | 'trainer'
            mongoUserId: string
        }

        // Attach clerkId to request for easy access in controllers
        req.clerkId = userId

        // Attach user metadata to req.user (matches old JWT structure)
        req.user = {
            activeProfile,
            mongoUserId
        }

        next()
    } catch (error) {
        console.error('Error fetching Clerk user:', error)
        return res.status(500).json({
            success: false,
            message: "Failed to fetch user data"
        })
    }
}
