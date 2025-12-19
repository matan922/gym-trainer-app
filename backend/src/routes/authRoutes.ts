import express from 'express';
import jwt from 'jsonwebtoken'
import bcrypt from "bcrypt"
import type { Request, Response, NextFunction } from 'express';
import { login, register, generateNewAccessToken, logout, forgotPassword, resetPassword, verifyEmail, clientSetup } from '../controller/authController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { generateAccessToken } from '../helper/genAccessToken.js';

const router = express.Router();

// Trainer
router.post('/register', register)
router.post('/login', login)
router.post('/token', generateNewAccessToken) // used to generate new access token from refresh token
router.post('/verify-email', verifyEmail)
router.delete('/logout', logout)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)

// Client
router.post('/client-setup', clientSetup)





export default router;