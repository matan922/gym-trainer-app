import nodeMailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

export const transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
})

