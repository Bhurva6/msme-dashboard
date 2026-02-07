import jwt from 'jsonwebtoken';
import { getEnv } from '../config/env';

/**
 * Generate a 6-digit OTP
 */
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * JWT Payload interface
 */
export interface JWTPayload {
  userId: string;
  role: string;
  iat?: number;
  exp?: number;
}

/**
 * Generate JWT token with 7-day expiry
 */
export function generateJWT(userId: string, role: string): string {
  const payload: JWTPayload = {
    userId,
    role,
  };

  const secret = getEnv('JWT_SECRET');
  const token = jwt.sign(payload, secret, {
    expiresIn: '7d',
  });

  return token;
}

/**
 * Verify and decode JWT token
 */
export function verifyJWT(token: string): JWTPayload {
  try {
    const secret = getEnv('JWT_SECRET');
    const decoded = jwt.verify(token, secret) as JWTPayload;
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}
