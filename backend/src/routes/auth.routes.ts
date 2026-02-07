import { Router } from 'express';
import {
  signup,
  verifyOTP,
  loginWithEmail,
  setPassword,
  getMe,
  resendOTP,
} from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import {
  validateSignup,
  validateOTPVerification,
  validateLogin,
  validateSetPassword,
} from '../middleware/validation.middleware';
import { asyncHandler } from '../middleware/error.middleware';

const router = Router();

/**
 * @route   POST /api/v1/auth/signup
 * @desc    Register new user and send OTP
 * @access  Public
 */
router.post('/signup', validateSignup, asyncHandler(signup));

/**
 * @route   POST /api/v1/auth/verify-otp
 * @desc    Verify OTP and create/login user
 * @access  Public
 */
router.post('/verify-otp', validateOTPVerification, asyncHandler(verifyOTP));

/**
 * @route   POST /api/v1/auth/resend-otp
 * @desc    Resend OTP to phone number
 * @access  Public
 */
router.post('/resend-otp', asyncHandler(resendOTP));

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login with email and password
 * @access  Public
 */
router.post('/login', validateLogin, asyncHandler(loginWithEmail));

/**
 * @route   POST /api/v1/auth/set-password
 * @desc    Set password for authenticated user
 * @access  Private
 */
router.post(
  '/set-password',
  authenticateToken,
  validateSetPassword,
  asyncHandler(setPassword)
);

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current user details
 * @access  Private
 */
router.get('/me', authenticateToken, asyncHandler(getMe));

export default router;
