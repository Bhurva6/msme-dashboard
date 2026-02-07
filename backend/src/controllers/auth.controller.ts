import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { UserModel } from '../models/User';
import { SMSService } from '../services/sms.service';
import { generateJWT } from '../utils/otp.generator';
import { AuthRequest } from '../middleware/auth.middleware';

/**
 * Signup - Send OTP to phone number
 */
export async function signup(req: Request, res: Response): Promise<void> {
  try {
    const { phone, email } = req.body;

    // Check if phone already exists
    const existingUser = await UserModel.findByPhone(phone);
    if (existingUser) {
      res.status(409).json({
        success: false,
        error: 'Phone number already registered',
      });
      return;
    }

    // Check if email already exists (if provided)
    if (email) {
      const existingEmail = await UserModel.findByEmail(email);
      if (existingEmail) {
        res.status(409).json({
          success: false,
          error: 'Email already registered',
        });
        return;
      }
    }

    // Send OTP
    const result = await SMSService.sendOTP(phone);

    if (!result.success) {
      res.status(429).json({
        success: false,
        error: result.message,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'OTP sent to phone number',
      data: {
        phone,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
}

/**
 * Verify OTP and create user
 */
export async function verifyOTP(req: Request, res: Response): Promise<void> {
  try {
    const { phone, otp, name, email } = req.body;

    // Verify OTP
    const verification = SMSService.verifyOTP(phone, otp);

    if (!verification.success) {
      res.status(400).json({
        success: false,
        error: verification.message,
      });
      return;
    }

    // Check if user already exists
    let user = await UserModel.findByPhone(phone);

    if (!user) {
      // Create new user
      user = await UserModel.create({
        name,
        phone,
        email,
        role: 'owner',
      });
    }

    // Generate JWT token
    const token = generateJWT(user.id, user.role);

    // Sanitize user data
    const sanitizedUser = UserModel.sanitizeUser(user);

    res.status(201).json({
      success: true,
      message: 'User verified successfully',
      data: {
        token,
        user: sanitizedUser,
      },
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    throw error;
  }
}

/**
 * Login with email and password
 */
export async function loginWithEmail(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    // Demo account bypass
    if (email === 'demo@msme.com' && password === 'Demo@123') {
      const demoUser = {
        id: 'demo-user-id',
        name: 'Demo User',
        email: 'demo@msme.com',
        phone: '+919999999999',
        role: 'owner' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const token = generateJWT(demoUser.id, demoUser.role);

      res.status(200).json({
        success: true,
        message: 'Demo login successful',
        data: {
          token,
          user: {
            id: demoUser.id,
            name: demoUser.name,
            email: demoUser.email,
            phone: demoUser.phone,
            role: demoUser.role,
          },
        },
      });
      return;
    }

    // Find user by email
    const user = await UserModel.findByEmail(email);

    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
      return;
    }

    // Check if user has a password set
    if (!user.password_hash) {
      res.status(401).json({
        success: false,
        error: 'Password not set. Please use phone OTP to login.',
      });
      return;
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
      return;
    }

    // Generate JWT token
    const token = generateJWT(user.id, user.role);

    // Sanitize user data
    const sanitizedUser = UserModel.sanitizeUser(user);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: sanitizedUser,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

/**
 * Set password for user
 */
export async function setPassword(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { password } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
      return;
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Update user password
    await UserModel.updatePassword(userId, hashedPassword);

    res.status(200).json({
      success: true,
      message: 'Password set successfully',
    });
  } catch (error) {
    console.error('Set password error:', error);
    throw error;
  }
}

/**
 * Get current user details
 */
export async function getMe(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
      return;
    }

    // Get user from database
    const user = await UserModel.findById(userId);

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found',
      });
      return;
    }

    // Sanitize user data
    const sanitizedUser = UserModel.sanitizeUser(user);

    res.status(200).json({
      success: true,
      data: {
        user: sanitizedUser,
      },
    });
  } catch (error) {
    console.error('Get me error:', error);
    throw error;
  }
}

/**
 * Resend OTP
 */
export async function resendOTP(req: Request, res: Response): Promise<void> {
  try {
    const { phone } = req.body;

    // Send OTP
    const result = await SMSService.sendOTP(phone);

    if (!result.success) {
      res.status(429).json({
        success: false,
        error: result.message,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    throw error;
  }
}
