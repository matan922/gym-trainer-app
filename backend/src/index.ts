import dotenv from 'dotenv';
dotenv.config()
import express from "express";
import mongoose from "mongoose";
import { connectDB } from "./config/db";
import cors from "cors";
import clientRoutes from "./routes/clientRoutes";
import authRoutes from "./routes/authRoutes";
import cookieParser from "cookie-parser";
import sessionRoutes from "./routes/sessionRoutes";

connectDB();

const app = express();

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors({
    origin: 'http://localhost:5173', // Your frontend URL
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
    app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));

})

