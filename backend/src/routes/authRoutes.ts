import express from 'express';
import { validateInviteToken, sendClientInvite, syncUser, createProfile, testEmailSend } from '../controller/authController.js';
import { apiLimiter } from '../middlewares/rateLimitersMiddleware.js';
import { requireAuth, verifyClerkToken } from '../middlewares/clerkAuthMiddleware.js';

const router = express.Router();

router.get('/sync-user', verifyClerkToken, requireAuth, syncUser)
router.post('/create-profile', verifyClerkToken, requireAuth, createProfile)
router.post('/send-client-invite', [apiLimiter, verifyClerkToken, requireAuth], sendClientInvite)
router.post('/validate-invite-token', apiLimiter, validateInviteToken)

router.get("/test-resend", testEmailSend)
export default router;