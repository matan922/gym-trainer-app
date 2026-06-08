import type { Request, Response } from "express";
import { resend } from "../config/emailConfig.js";
import crypto from 'crypto'
import User from "../models/user/User.js";
import { isValidProfileType, validateInvite } from "../helper/authHelper.js";
import ClientInviteToken from "../models/ClientInviteToken.js";
import TrainerClientRelation from "../models/TrainerClientRelation.js";
import { clerkClient } from "@clerk/express";


export const createProfile = async (req: Request, res: Response) => {
    try {
        const clerkId = req.clerkId
        const { firstName, lastName, email, profileType, age, weight, goal, notes, trainerType, inviteToken } = req.body

        if (!clerkId) {
            return res.status(401).json({ success: false, message: "Unauthorized" })
        }

        if (!isValidProfileType(profileType)) {
            return res.status(400).json({ success: false, message: "Invalid profile type" })
        }

        // Check if user already exists
        const existing = await User.findOne({ clerkId })
        if (existing) {
            return res.status(400).json({ success: false, message: "Profile already exists" })
        }

        // Create MongoDB user
        const user = new User({
            clerkId,
            email,
            firstName,
            lastName,
            activeProfile: profileType
        })

        if (profileType === 'trainer') {
            user.profiles.trainer = { trainerType: trainerType || 'personal' }
        } else {
            user.profiles.client = { age, weight, goal, notes }
        }

        await user.save()

        // Sync activeProfile to Clerk metadata
        await clerkClient.users.updateUser(clerkId, {
            publicMetadata: {
                activeProfile: user.activeProfile,
                mongoUserId: user._id.toString()
            }
        })

        // Handle invite token if present
        if (inviteToken) {
            const inviteTokenInDb = await ClientInviteToken.findOne({ token: inviteToken })
            if (inviteTokenInDb) {
                await TrainerClientRelation.create({
                    clientId: user._id,
                    trainerId: inviteTokenInDb.userTrainerId,
                    status: "active"
                })
                inviteTokenInDb.usedAt = new Date()
                await inviteTokenInDb.save()
            }
        }

        res.status(201).json({ success: true, user })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Something went wrong" })
    }
}

export const syncUser = async (req: Request, res: Response) => {
    const clerkId = req.clerkId

    if (!clerkId) {
        return res.status(401).json({ success: false, message: "Unauthorized" })
    }

    const user = await User.findOne({ clerkId })
    if (!user) {
        return res.status(404).json({ success: false, message: "User not found. Please register first." })
    }

    res.json({ success: true, user });
}

export const sendClientInvite = async (req: Request, res: Response) => {
    try {
        const currentProfile = req.user?.activeProfile
        const userId = req.user?.mongoUserId
        const email = req.body.email

        if (currentProfile !== 'trainer') {
            return res.status(404).json({ message: "Only a trainer can send an invite" })
        }

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const myTrainerUser = await User.findById(userId)
        if (myTrainerUser && myTrainerUser.email === email) {
            return res.status(400).json({ message: "You cant send an invite to yourself" })
        }

        const trainerName = `${myTrainerUser?.firstName} ${myTrainerUser?.lastName}` || 'your trainer'
        await ClientInviteToken.findOneAndDelete({ clientEmail: email })
        const inviteToken = crypto.randomBytes(32).toString('hex')
        await ClientInviteToken.create({ token: inviteToken, clientEmail: email, userTrainerId: userId, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) })

        const frontendUrl = process.env.CORS_ORIGIN || 'http://localhost:5173'
        const { data, error } = await resend.emails.send({
            from: "הזמנת מאמן <noreply@merkaz-imunim.com>",
            to: [req.body.email],
            subject: `הוזמן על ידי ${trainerName}`,
            html: `<a href="${frontendUrl}/invite-accept?token=${inviteToken}">הירשם כאן</a>`,
        })

        if (error) {
            res.status(400).json({ error })
        }

        res.status(201).json({ data, message: "Invite sent" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Something went wrong" })
    }
}

export const validateInviteToken = async (req: Request, res: Response) => {
    try {
        const { inviteToken } = req.body;

        const existingInviteToken = await ClientInviteToken.findOne({ token: inviteToken })
        if (existingInviteToken?.usedAt) {
            return res.status(401).json({ success: false, message: "הזמנה לא תקפה" })
        }
        const invite = await validateInvite(inviteToken)

        const existingUser = await User.findOne({ email: invite.clientEmail });
        const user = await User.findById(invite.userTrainerId)
        const trainerName = `${user?.firstName} ${user?.lastName}` || 'your trainer'

        res.status(200).json({
            valid: true, trainerName: trainerName, clientEmail: invite.clientEmail, userExists: existingUser ? true : false, hasClientProfile: existingUser?.profiles.client ? true : false
        })
    } catch (error) {
        console.log(error)
        if (error instanceof Error &&
            (error.message.includes("Invalid") ||
                error.message.includes("Expired") ||
                error.message.includes("used"))) {
            return res.status(400).json({ success: false, message: error.message });
        }
        res.status(500).json({ success: false, message: "Something went wrong" })
    }
}

export const addProfile = async (req: Request, res: Response) => {
    try {
        const clerkId = req.clerkId
        const mongoUserId = req.user?.mongoUserId;
        const { profileType, trainerType, age, weight, goal, notes } = req.body;

        if (!isValidProfileType(profileType)) {
            return res.status(400).json({ message: "Invalid profile type" });
        }

        const user = await User.findById(mongoUserId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.profiles[profileType]) {
            return res.status(400).json({ message: `${profileType} profile already exists` });
        }

        if (profileType === 'trainer') {
            user.profiles.trainer = { trainerType };
        } else {
            user.profiles.client = { age, weight, goal, notes };
        }

        user.activeProfile = profileType;
        await user.save();

        if (clerkId) {
            await clerkClient.users.updateUser(clerkId, {
                publicMetadata: {
                    activeProfile: user.activeProfile,
                    mongoUserId: user._id.toString()
                }
            })
        }

        res.status(200).json({
            success: true,
            message: `${profileType} profile added successfully`
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Something went wrong" })
    }
}

export const changeProfile = async (req: Request, res: Response) => {
    try {
        const clerkId = req.clerkId
        const mongoUserId = req.user?.mongoUserId

        const user = await User.findById(mongoUserId)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        const targetProfile = user.activeProfile === "trainer" ? "client" : "trainer";
        if (!user.profiles[targetProfile]) {
            return res.status(400).json({ success: false, message: `You don't have a ${targetProfile} profile. Create one first.` });
        }

        user.activeProfile = targetProfile;
        await user.save()

        if (clerkId) {
            await clerkClient.users.updateUser(clerkId, {
                publicMetadata: {
                    activeProfile: user.activeProfile,
                    mongoUserId: user._id.toString()
                }
            })
        }

        res.status(200).json({ success: true, message: `Switched to ${targetProfile} profile`, user })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Something went wrong" })
    }
}

export const testEmailSend = async (req: Request, res: Response) => {
    const { data, error } = await resend.emails.send({
        from: "ברוך הבא למרכז האימונים! <noreply@merkaz-imunim.com>",
        to: ["matanten@gmail.com"],
        subject: "שלום מאימייל האימונים החדש שלי!",
        html: "<strong>איזה יופי!!!</strong>",
    })

    if (error) {
        res.status(400).json({ error })
    }

    res.status(200).json({ data })
}