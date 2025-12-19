import dotenv from 'dotenv';
dotenv.config()
import express from "express";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import cors from "cors";
import clientRoutes from "./routes/clientRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import sessionRoutes from "./routes/sessionRoutes.js";
import { rateLimit } from 'express-rate-limit'

connectDB();

const app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
})

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true // Allow cookies to be sent
}))
app.use(cookieParser())

app.use('/clients', clientRoutes)
app.use('/auth', authRoutes)
app.use('/sessions', sessionRoutes)

app.get("/health", (req, res) => {
    res.json({ health: "Success" });
});

mongoose.connection.once('open', () => {
    console.log("Connected to MongoDB")

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})