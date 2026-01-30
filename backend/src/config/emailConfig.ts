import nodeMailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()
import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);


resend.emails.send({
    from: 'onboarding@resend.dev',
    to: 'matanten@gmail.com',
    subject: 'Hello World',
    html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
});





export const transporter = nodeMailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
})

