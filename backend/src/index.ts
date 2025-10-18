import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db";
import mongoose from "mongoose";
import Client from "./models/Client";
import clientRoutes from "./routes/clientRoutes";
connectDB();

const app = express();

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors());

app.use('/clients', clientRoutes)

app.get("/health", (req, res) => {
    res.json({ health: "Success" });
});


const PORT = 5000;

mongoose.connection.once('open', () => {
    console.log("Connected to MongoDB")
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

})

