import { Request, Response, NextFunction } from 'express';
import {
  validatePhone,
  validateEmail,
  validatePassword,
  validateOTP,
  sanitizeInput,
} from '../utils/validators';

/**
 * Validate signup request
 */
export function validateSignup(req: Request, res: Response, next: NextFunction): void {
  const { name, phone, email } = req.body;

  // Validate name
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    res.status(400).json({
      success: false,
      error: 'Name is required and must be a non-empty string',
    });
    return;
  }

  if (name.trim().length < 2 || name.trim().length > 255) {
    res.status(400).json({
      success: false,
      error: 'Name must be between 2 and 255 characters',
    });
    return;
  }

  // Validate phone
  if (!phone || typeof phone !== 'string') {
    res.status(400).json({
      success: false,
      error: 'Phone number is required',
    });
    return;
  }

  if (!validatePhone(phone)) {
    res.status(400).json({
      success: false,
      error: 'Invalid phone number. Must be a 10-digit Indian phone number starting with 6-9',
    });
    return;
  }

  // Validate email if provided
  if (email && email.trim().length > 0) {
    if (!validateEmail(email)) {
      res.status(400).json({
        success: false,
        error: 'Invalid email format',
      });
      return;
    }
  }

  // Sanitize inputs
  req.body.name = sanitizeInput(name);
  if (email) {
    req.body.email = sanitizeInput(email);
  }

  next();
}

/**
 * Validate OTP verification request
 */
export function validateOTPVerification(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { phone, otp } = req.body;

  // Validate phone
  if (!phone || typeof phone !== 'string') {
    res.status(400).json({
      success: false,
      error: 'Phone number is required',
    });
    return;
  }

  if (!validatePhone(phone)) {
    res.status(400).json({
      success: false,
      error: 'Invalid phone number',
    });
    return;
  }

  // Validate OTP
  if (!otp || typeof otp !== 'string') {
    res.status(400).json({
      success: false,
      error: 'OTP is required',
    });
    return;
  }

  if (!validateOTP(otp)) {
    res.status(400).json({
      success: false,
      error: 'Invalid OTP format. Must be 6 digits',
    });
    return;
  }

  next();
}

/**
 * Validate email login request
 */
export function validateLogin(req: Request, res: Response, next: NextFunction): void {
  const { email, password } = req.body;

  // Validate email
  if (!email || typeof email !== 'string') {
    res.status(400).json({
      success: false,
      error: 'Email is required',
    });
    return;
  }

  if (!validateEmail(email)) {
    res.status(400).json({
      success: false,
      error: 'Invalid email format',
    });
    return;
  }

  // Validate password
  if (!password || typeof password !== 'string') {
    res.status(400).json({
      success: false,
      error: 'Password is required',
    });
    return;
  }

  if (password.length === 0) {
    res.status(400).json({
      success: false,
      error: 'Password cannot be empty',
    });
    return;
  }

  next();
}

/**
 * Validate set password request
 */
export function validateSetPassword(req: Request, res: Response, next: NextFunction): void {
  const { password } = req.body;

  // Validate password
  if (!password || typeof password !== 'string') {
    res.status(400).json({
      success: false,
      error: 'Password is required',
    });
    return;
  }

  if (!validatePassword(password)) {
    res.status(400).json({
      success: false,
      error:
        'Password must be at least 8 characters long and contain at least one letter and one number',
    });
    return;
  }

  next();
}

/**
 * Generic request validator
 * Usage: validateRequest([{ field: 'name', required: true, minLength: 2 }])
 */
interface ValidationRule {
  field: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  customValidator?: (value: any) => boolean;
  errorMessage?: string;
}

export function validateRequest(rules: ValidationRule[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    for (const rule of rules) {
      const value = req.body[rule.field];

      // Check if required
      if (rule.required && (value === undefined || value === null || value === '')) {
        res.status(400).json({
          success: false,
          error: rule.errorMessage || `${rule.field} is required`,
        });
        return;
      }

      // Skip further validation if value is empty and not required
      if (!value && !rule.required) {
        continue;
      }

      // Check min length
      if (rule.minLength && typeof value === 'string' && value.length < rule.minLength) {
        res.status(400).json({
          success: false,
          error: rule.errorMessage || `${rule.field} must be at least ${rule.minLength} characters`,
        });
        return;
      }

      // Check max length
      if (rule.maxLength && typeof value === 'string' && value.length > rule.maxLength) {
        res.status(400).json({
          success: false,
          error: rule.errorMessage || `${rule.field} must not exceed ${rule.maxLength} characters`,
        });
        return;
      }

      // Check pattern
      if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
        res.status(400).json({
          success: false,
          error: rule.errorMessage || `${rule.field} has invalid format`,
        });
        return;
      }

      // Check custom validator
      if (rule.customValidator && !rule.customValidator(value)) {
        res.status(400).json({
          success: false,
          error: rule.errorMessage || `${rule.field} is invalid`,
        });
        return;
      }
    }

    next();
  };
}
