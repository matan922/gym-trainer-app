import express from 'express';
import { login, register, generateNewAccessToken, logout, forgotPassword, resetPassword, verifyEmail, clientSetup } from '../controller/authController.js';
import { apiLimiter, loginLimiter, logoutLimiter, refreshLimiter } from '../middlewares/rateLimitersMiddleware.js';

const router = express.Router();

// Trainer
router.post('/register', apiLimiter, register)
router.post('/login', loginLimiter, login)
router.post('/token', refreshLimiter, generateNewAccessToken) // used to generate new access token from refresh token
router.post('/verify-email', apiLimiter, verifyEmail)
router.delete('/logout', logoutLimiter, logout)
router.post('/forgot-password', apiLimiter, forgotPassword)
router.post('/reset-password', apiLimiter, resetPassword)

// Client
router.post('/client-setup', clientSetup)





export default router;