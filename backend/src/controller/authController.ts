import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
import { generateAccessToken, generateRefreshToken } from "../helper/genAccessToken.js";
import RefreshToken from "../models/RefreshToken.js";
import { transporter } from "../config/emailConfig.js";
import crypto from 'crypto'
import PasswordResetToken from "../models/PasswordResetToken.js";
import EmailVerificationToken from "../models/EmailVerificationToken.js";
import User from "../models/user/User.js";
import { isValidProfileType, validateInvite } from "../helper/authHelper.js";
import ClientInviteToken from "../models/ClientInviteToken.js";
import TrainerClientRelation from "../models/TrainerClientRelation.js";

export const register = async (req: Request, res: Response) => {
    try {
        const profileType = req.body.profileType;
        const { email, password, firstName, lastName, age, weight, goal, notes } = req.body;
        // check is profileType is a valid profile (client or trainer)
        if (!isValidProfileType(profileType)) {
            return res.status(400).json({ success: false, message: "Invalid profile type" });
        }
        // Check if user exists
        const existingUser = await User.findOne({ email: email });

        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email already registered. Please login." });
        }

        // Create new user with one profile
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            email,
            password: hashedPassword,
            activeProfile: profileType
        });

        if (profileType === 'trainer') {
            newUser.profiles.trainer = { firstName, lastName };
        } else {
            newUser.profiles.client = { firstName, lastName, age, weight, goal, notes };
        }

        await newUser.save();

        // Send verification email
        const token = crypto.randomBytes(32).toString('hex');
        await EmailVerificationToken.create({
            token: token,
            userId: newUser._id,
            expiresAt: new Date(Date.now() + 60 * 60 * 1000)
        });

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        await transporter.sendMail({
            from: "Personal Trainer App",
            to: email,
            subject: "Email Verification",
            html: `<b>${frontendUrl}/auth/verify-email?token=${token}</b>`
        });

        const { password: _, ...userData } = newUser.toObject();
        res.status(201).json({ success: true, user: userData });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
}

export const sendClientInvite = async (req: Request, res: Response) => {
    try {
        const currentProfile = req.user?.activeProfile
        const userId = req.user?.id
        const email = req.body.email // Add email regex

        if (currentProfile !== 'trainer') {
            return res.status(404).json({ message: "Only a trainer can send an invite" })
        }

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const myTrainerUser = await User.findById(userId)
        if (myTrainerUser && myTrainerUser.email === email) {
            return res.status(400).json({message: "You cant send an invite to yourself"})
        }

        const trainerName = `${myTrainerUser?.profiles.trainer?.firstName} ${myTrainerUser?.profiles.trainer?.lastName}` || 'your trainer'
        await ClientInviteToken.findOneAndDelete({ clientEmail: email }) // delete if a token already exist for that client email
        const inviteToken = crypto.randomBytes(32).toString('hex') // new random token
        await ClientInviteToken.create({ token: inviteToken, clientEmail: email, userTrainerId: userId, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) })


        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
        await transporter.sendMail({
            from: "Merkaz Imunim",
            to: req.body.email,
            subject: `Invited by ${trainerName}`,
            html: `<h1>${frontendUrl}/auth/invite-accept?token=${inviteToken}</h1>`
        })

        res.status(201).json({ success: true, message: "Invite sent" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Something went wrong" })
    }
}


export const validateInviteToken = async (req: Request, res: Response) => {
    try {
        const { inviteToken } = req.params;

        if (!inviteToken) {
            return res.status(400).json({ success: false, message: "Invalid token" })
        }
        const invite = await validateInvite(inviteToken)

        // Check if user exists
        const existingUser = await User.findOne({ email: invite.clientEmail });

        const user = await User.findById(invite.userTrainerId)
        const trainerName = `${user?.profiles.trainer?.firstName} ${user?.profiles.trainer?.lastName}` || 'your trainer'

        // if userExists = false => save the inviteToken in local storage and redirect user to register (a client profile). after register make frontend detect the inviteToken in local storage and send request to create relation.
        // if userExists = true but hasClientProfile = false => save the inviteToken in local storage and redirect user to login. after login redirect them to addProfile route. after creating a profile make frontend detect the inviteToken in local storage and send request to create a relation.
        // if userExists = true and hasClientProfile = true  => save the inviteToken in local storage and redirect user to login. after login make frontend detect the inviteToken in local storage and send request to create relation.
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


export const inviteAcceptAuthenticated = async (req: Request, res: Response) => {
    try {
        const userClient = req.user
        const { inviteToken } = req.body
        const invite = await validateInvite(inviteToken)
        const trainerId = invite.userTrainerId
        const clientId = userClient?.id
        const clientEmail = invite.clientEmail

        const loggedClientUser = await User.findById(clientId)
        if (loggedClientUser && clientEmail !== loggedClientUser.email) {
            return res.status(403).json({ message: 'Emails dont match' })
        }

        const relationExist = await TrainerClientRelation.findOne({ trainerId: trainerId, clientId: clientId })
        if (relationExist && relationExist.status === "active") {
            return res.status(400).json({ message: 'Relation already exist' })
        } else if (relationExist && relationExist.status === "ended") {
            await TrainerClientRelation.updateOne({ _id: relationExist._id }, { status: 'active', $unset: { endedAt: 1 } })
        } else {
            await TrainerClientRelation.create({ trainerId: trainerId, clientId: clientId, status: 'active' })
        }

        invite.usedAt = new Date()
        await invite.save()
        return res.status(201).json({ message: 'Created relation to trainer' })
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
        const userId = req.user?.id;
        const { profileType, firstName, lastName, age, weight, goal, notes } = req.body;

        if (!isValidProfileType(profileType)) {
            return res.status(400).json({ message: "Invalid profile type" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.profiles[profileType]) {
            return res.status(400).json({ message: `${profileType} profile already exists` });
        }

        if (profileType === 'trainer') {
            user.profiles.trainer = { firstName, lastName };
        } else {
            user.profiles.client = { firstName, lastName, age, weight, goal, notes };
        }

        user.activeProfile = profileType; // Switch to new profile
        await user.save();

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
        const userId = req.user?.id

        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        const targetProfile = user.activeProfile === "trainer" ? "client" : "trainer";
        if (!user.profiles[targetProfile]) {
            return res.status(400).json({ success: false, message: `You don't have a ${targetProfile} profile. Create one first.` });
        }

        user.activeProfile = targetProfile;
        await user.save()

        const accessToken = generateAccessToken({ id: user._id, activeProfile: user.activeProfile });
        const refreshToken = generateRefreshToken({ id: user._id, activeProfile: user.activeProfile });

        // Delete old token and create a new one
        await RefreshToken.deleteOne({ userId: user._id });
        await RefreshToken.create({
            token: refreshToken,
            userId: user._id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });

        // Set new cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : "lax",
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/'
        });

        res.status(200).json({ success: true, message: `Switched to ${targetProfile} profile`, accessToken })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ scuccess: false, message: "Something went wrong" })
    }
}

export const endTrainerRelation = async (req: Request, res: Response) => {
    
}

export const verifyEmail = async (req: Request, res: Response) => {
    try {
        const { token } = req.body

        const tokenInDb = await EmailVerificationToken.findOne({
            token,
            expiresAt: { $gt: new Date() } // greater than now
        })
        if (!tokenInDb) {
            return res.status(401).json({ success: false, message: "Invalid token" })
        }

        await User.findOneAndUpdate({ _id: tokenInDb.userId }, { emailVerified: true })
        await EmailVerificationToken.deleteOne({ token })
        return res.status(200).json({ success: true, message: "Successfully verified the email" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Something went wrong" })
    }
}

// Login function that creates access and refresh tokens for the client
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password, loginAs, inviteToken } = req.body

        if (!email || !password || !loginAs) {
            return res.status(400).json({ success: false, message: `Missing data` })
        }

        if (!isValidProfileType(loginAs)) {
            return res.status(400).json({ success: false, message: "Invalid profile type" });
        }

        const user = await User.findOne({ email: email }).select("+password")
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials (no user)' })
        }


        if (loginAs === 'trainer' && !user.profiles.trainer) {
            return res.status(400).json({ message: "No trainer profile" });
        }
        if (loginAs === 'client' && !user.profiles.client) {
            return res.status(400).json({ message: "No client profile" });
        }

        if (!user.emailVerified) {
            return res.status(401).json({ success: false, message: "Verify your email address first" })
        }

        if (await bcrypt.compare(password, user.password)) {
            user.activeProfile = loginAs
            await user.save()
            await RefreshToken.deleteOne({ userId: user._id }) // Delete refresh token if already existing for trainer
            const accessToken = generateAccessToken({ id: user._id, activeProfile: user.activeProfile })
            const refreshToken = generateRefreshToken({ id: user._id, activeProfile: user.activeProfile })


            // store in httponly cookie
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                sameSite: process.env.NODE_ENV === 'production' ? 'strict' : "lax", // development
                secure: process.env.NODE_ENV === 'production',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                path: '/'
            })

            await RefreshToken.create({
                token: refreshToken,
                userId: user._id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            })

            res.json({ success: true, accessToken })
        } else {
            res.status(401).json({ success: false, message: "Invalid credentials" })
        }
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

// used to generate a new access token from the refresh token sent from logging in
export const generateNewAccessToken = async (req: Request, res: Response) => {
    try {
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) {
            return res.status(401).json({ success: false, message: "No token found (in cookie)" })
        }

        const tokenExisting = await RefreshToken.findOne({ token: refreshToken }).exec()
        if (!tokenExisting) {
            return res.status(401).json({ success: false, message: "No token found (in db)" })
        }

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!, async (err: any, payload: any) => {
            if (err) return res.status(403).json({ success: false, message: "Invalid token" })

            const accessToken = generateAccessToken({ id: payload.id, activeProfile: payload.activeProfile })
            const newRefreshToken = generateRefreshToken({ id: payload.id, activeProfile: payload.activeProfile })

            await RefreshToken.findOneAndUpdate(
                { token: refreshToken },
                {
                    token: newRefreshToken,
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                }
            )

            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                sameSite: process.env.NODE_ENV === 'production' ? 'strict' : "lax", // development
                secure: process.env.NODE_ENV === 'production',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                path: '/'
            })

            res.json({ accessToken })
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Something went wrong" })
    }
}

export const logout = async (req: Request, res: Response) => {
    try {
        const refreshToken = req.cookies.refreshToken
        if (refreshToken) {
            await RefreshToken.deleteOne({ token: refreshToken })
        }

        res.clearCookie('refreshToken')
        return res.sendStatus(204)
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Something went wrong" })
    }
}

export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const email = req.body.email
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(200).json({ message: "If email exists a code will be sent (failed)" })
        }

        const token = crypto.randomBytes(32).toString('hex')
        await PasswordResetToken.create({
            token: token,
            userId: user?._id,
            expiresAt: new Date(Date.now() + 60 * 60 * 1000) // 60 minutes
        })

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
        await transporter.sendMail({
            from: "Merkaz Imunim",
            to: req.body.email,
            subject: "Forgot Password",
            html: `<h1>${frontendUrl}/auth/reset-password?token=${token}</h1>`
        })

        res.status(200).json({ message: "If email exists a code will be sent (success)" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Something went wrong" })
    }
}

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { token, password } = req.body

        const tokenInDb = await PasswordResetToken.findOne({
            token,
            expiresAt: { $gt: new Date() } // greater than now
        })
        if (!tokenInDb) {
            return res.status(401).json({ success: false, message: "Invalid token or expired token" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        await User.updateOne({ _id: tokenInDb.userId }, { password: hashedPassword })
        await PasswordResetToken.deleteOne({ token })

        return res.status(200).json({ success: true, message: "Password changed" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Something went wrong" })
    }
}

export const changePassword = async (req: Request, res: Response) => {
    // TODO
}



// Client auth
// export const clientSetup = async (req: Request, res: Response) => {
//     const { token, password } = req.body

//     await Client.findOne()
// }

// export const inviteAccept = async (req: Request, res: Response) => {
//     try {
//         const { inviteToken, password, firstName, lastName, age, weight, goal, notes } = req.body

//         if (!inviteToken) {
//             return res.status(400).json({ message: "Token required" });
//         }

//         const invite = await validateInvite(inviteToken)
//         const clientEmail = invite.clientEmail

//         const existingUser = await User.findOne({ email: clientEmail })

//         let clientId
//         if (!existingUser) {
//             // OPTION 1: brand new user
//             const hashedPassword = await bcrypt.hash(password, 10);
//             const newUser = new User({
//                 email: clientEmail,
//                 password: hashedPassword,
//                 emailVerified: true,
//                 activeProfile: 'client'
//             })
//             newUser.profiles.client = { firstName, lastName, age, weight, goal, notes }
//             await newUser.save()
//             clientId = newUser._id

//         } else if (!existingUser.profiles.client) {
//             // OPTION 2: User exists (trainer) but no client profile
//             if (!password) {
//                 return res.status(400).json({ message: "Password required to verify identity" });
//             }

//             const passwordMatch = await bcrypt.compare(password, existingUser.password);
//             if (!passwordMatch) {
//                 return res.status(401).json({ message: "Invalid password" });
//             }

//             existingUser.profiles.client = { firstName: existingUser.profiles.trainer?.firstName || firstName, lastName: existingUser.profiles.trainer?.lastName || lastName, age, weight, goal, notes }
//             await existingUser.save()

//             clientId = existingUser._id
//         } else {
//             // OPTION 3: User exists with client profile already
//             // This shouldn't happen through this endpoint - they should login first
//             return res.status(400).json({ message: "User already has client profile. Please login to accept invite." })
//         }

//         await TrainerClientRelation.create({ trainerId: invite.userTrainerId, clientId: clientId, status: 'active' })
//         await ClientInviteToken.findOneAndUpdate({ token: inviteToken }, { usedAt: Date.now() })

//         res.status(200).json({ success: true, message: "Invite accepted" })
//     } catch (error) {
//         console.log(error)
//         if (error instanceof Error &&
//             (error.message.includes("Invalid") ||
//                 error.message.includes("Expired") ||
//                 error.message.includes("used"))) {
//             return res.status(400).json({ success: false, message: error.message });
//         }
//         res.status(500).json({ success: false, message: "Something went wrong" })
//     }
// }
