import type { Request, Response } from "express";
import Trainer from "../models/Trainer.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
import { generateAccessToken, generateRefreshToken } from "../helper/genAccessToken.js";
import RefreshToken from "../models/RefreshToken.js";
import { transporter } from "../config/emailConfig.js";
import crypto from 'crypto'
import PasswordResetToken from "../models/PasswordResetToken.js";
import EmailVerificationToken from "../models/EmailVerificationToken.js";
import Client from "../models/Client.js";

export const register = async (req: Request, res: Response) => {
    try {
        const existing = await Trainer.findOne({ email: req.body.email })

        if (existing) {
            return res.status(400).json({ success: false, message: "Email already taken" })
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const newTrainer = new Trainer({ firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email, password: hashedPassword })
        await newTrainer.save()
        const { password, ...trainerData } = newTrainer.toObject()

        const token = crypto.randomBytes(32).toString('hex')
        await EmailVerificationToken.create({
            token: token,
            trainerId: trainerData._id,
            expiresAt: new Date(Date.now() + 60 * 60 * 1000) // 60 minutes
        })

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
        console.log(frontendUrl)
        await transporter.sendMail({
            from: "Personal Trainer App",
            to: req.body.email,
            subject: "Email Verification",
            html: `<b>${frontendUrl}/auth/verify-email?token=${token}</b>`
        })

        res.status(200).json({ success: true, trainerData })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Something went wrong" })
    }
}

export const verifyEmail = async (req: Request, res: Response) => {
    try {
        const { token } = req.body
        console.log(token)

        const tokenInDb = await EmailVerificationToken.findOne({
            token,
            expiresAt: { $gt: new Date() } // greater than now
        })
        if (!tokenInDb) {
            return res.status(401).json({ success: false, message: "Invalid token" })
        }

        await Trainer.findOneAndUpdate({ _id: tokenInDb.trainerId }, { emailVerified: true })
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
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Missing data" })
        }
        const trainer = await Trainer.findOne({ email: email })


        if (!trainer) {
            return res.status(401).json({ success: false, message: 'Invalid credentials (no trainer)' })
        }

        if (!trainer.emailVerified) {
            return res.status(401).json({ success: false, message: "Verify your email address first" })
        }

        if (await bcrypt.compare(password, trainer.password)) {
            const accessToken = generateAccessToken({ id: trainer._id })
            const refreshToken = generateRefreshToken({ id: trainer.id })
            await RefreshToken.deleteOne({ trainerId: trainer._id }) // Delete refresh token if already existing for trainer

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
                trainerId: trainer._id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            })

            const { password: _, ...trainerData } = trainer.toObject()
            res.json({ success: true, trainer: trainerData, accessToken, refreshToken })
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

        const accessToken = generateAccessToken({ id: payload.id })
        const newRefreshToken = generateRefreshToken({ id: payload.id })

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
        const trainer = await Trainer.findOne({ email })

        if (!trainer) {
            return res.status(200).json({ message: "If email exists a code will be sent (failed)" })
        }

        const token = crypto.randomBytes(32).toString('hex')
        await PasswordResetToken.create({
            token: token,
            trainerId: trainer?._id,
            expiresAt: new Date(Date.now() + 60 * 60 * 1000) // 60 minutes
        })

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
        await transporter.sendMail({
            from: "Personal Trainer App",
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
        await Trainer.updateOne({ _id: tokenInDb.trainerId }, { password: hashedPassword })
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
export const clientSetup = async (req: Request, res: Response) => {
    const { token, password } = req.body

    await Client.findOne()
}



// test
export const testAuthorized = async (req: Request, res: Response) => {
    console.log("USER DATA = ", req.user)
    return res.sendStatus(200)
}

