import dotenv from 'dotenv';
dotenv.config()
import express, { type Request, type Response } from "express";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import cors from "cors";
import trainerClientRoutes from "./routes/trainer/clientRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import trainerSessionRoutes from "./routes/trainer/sessionRoutes.js";
import trainerRoutes from './routes/trainer/trainerRoutes.js';
import clientRoutes from './routes/client/clientRoutes.js';
import workoutRoutes from './routes/client/workoutRoutes.js';
import clientSessionRoutes from "./routes/client/sessionsRoutes.js";
import { google } from 'googleapis'

connectDB();

const app = express();


app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true // Allow cookies to be sent
}))
app.use(cookieParser())

const oauth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.SECRET_ID, process.env.REDIRECT)

app.use('/auth', authRoutes)
// app.get('/', (req: Request, res: Response) => {
//     const url = oauth2Client.generateAuthUrl({
//         access_type: 'offline',
//         scope: 'https://www.googleapis.com/auth/calendar.readonly'
//     })
//     res.redirect(url)
// })
// app.get('/redirect', (req: Request, res: Response) => {
//     const code: any = req.query.code
//     oauth2Client.getToken(code, (err, tokens) => {
//         if (err) {
//             console.log('Couldnt get token', err)
//             res.send('Error')
//             return
//         }
//         if (!tokens) {
//             res.send('Error')
//             return
//         }
//         oauth2Client.setCredentials(tokens)
//         return res.send('Logged in')
//     })
// })
// app.get('/calendars', (req: Request, res: Response) => {
//     const calendar = google.calendar({ version: 'v3', auth: oauth2Client })
//     console.log(calendar)
//     calendar.calendarList.list({}, (err, response) => {
//         if (err) {
//             console.log('error fetching calendars', err)
//             res.send('Error!')
//             return
//         }
//         const calendars = response?.data.items
//         return res.json(calendars)
//     })
// })
// trainer request routes
app.use('/trainer', trainerRoutes)
app.use('/trainer/clients', trainerClientRoutes)
app.use('/trainer/sessions', trainerSessionRoutes)

// client request routes
app.use('/client', clientRoutes)
app.use('/client/workouts', workoutRoutes)
app.use('/client/sessions', clientSessionRoutes)

app.get("/health", (req, res) => {
    res.json({ health: "Success" });
});

mongoose.connection.once('open', () => {
    console.log("Connected to MongoDB")

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})