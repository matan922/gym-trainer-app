import express from 'express';
import jwt from 'jsonwebtoken'
import bcrypt from "bcrypt"
import type { Request, Response, NextFunction } from 'express';
import { login, register, testAuthorized, generateNewAccessToken, logout } from '../controller/authController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { generateAccessToken } from '../helper/genAccessToken';

const router = express.Router();

router.post('/register', register)
router.post('/login', login)
router.post('/token', generateNewAccessToken) // used to generate new access token from refresh token
router.delete('/logout', logout)

router.get('/test-authorized', authenticateToken, testAuthorized)




export default router;