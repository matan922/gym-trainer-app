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
import trainerRoutes from './routes/trainerRoutes.js';

connectDB();

const app = express();


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
app.use('/trainer', trainerRoutes)

app.get("/health", (req, res) => {
    res.json({ health: "Success" });
});

mongoose.connection.once('open', () => {
    console.log("Connected to MongoDB")

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})