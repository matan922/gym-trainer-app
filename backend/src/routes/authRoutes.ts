import express from 'express';
import { login, register, generateNewAccessToken, logout, forgotPassword, resetPassword, verifyEmail, inviteAccept, validateInviteToken, sendClientInvite } from '../controller/authController.js';
import { apiLimiter, loginLimiter, logoutLimiter, refreshLimiter } from '../middlewares/rateLimitersMiddleware.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', apiLimiter, register)
router.post('/login', loginLimiter, login)
router.post('/token', refreshLimiter, generateNewAccessToken) // used to generate new access token from refresh token
router.post('/verify-email', apiLimiter, verifyEmail)
router.delete('/logout', logoutLimiter, logout)
router.post('/forgot-password', apiLimiter, forgotPassword)
router.post('/reset-password', apiLimiter, resetPassword)
router.post('/send-client-invite', [apiLimiter, authenticateToken], sendClientInvite)
router.post('/invite-accept', apiLimiter, inviteAccept)
router.get('/validate-invite-token', apiLimiter, validateInviteToken)





export default router;