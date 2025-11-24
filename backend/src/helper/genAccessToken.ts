import jwt from 'jsonwebtoken'
import type mongoose from 'mongoose'

export function generateAccessToken(user: { "id": mongoose.Types.ObjectId }) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '30m' })
}


export function generateRefreshToken(user: { "id": mongoose.Types.ObjectId }) {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: "7d" })
}


