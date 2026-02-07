import { Request, Response, NextFunction } from 'express';
import { getEnv } from '../config/env';

/**
 * Custom error class
 */
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global error handling middleware
 */
export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const timestamp = new Date().toISOString();
  const isProduction = getEnv('NODE_ENV') === 'production';

  // Log error
  console.error(`[${timestamp}] Error:`, {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
  });

  // Default error values
  let statusCode = 500;
  let message = 'Internal Server Error';

  // Handle custom AppError
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Handle specific error types
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
  }

  // PostgreSQL errors
  if ('code' in err) {
    const pgError = err as any;
    
    if (pgError.code === '23505') {
      // Unique violation
      statusCode = 409;
      message = 'Resource already exists';
      
      if (pgError.constraint === 'users_phone_key') {
        message = 'Phone number already registered';
      } else if (pgError.constraint === 'users_email_key') {
        message = 'Email already registered';
      }
    }

    if (pgError.code === '23503') {
      // Foreign key violation
      statusCode = 400;
      message = 'Invalid reference';
    }

    if (pgError.code === '23502') {
      // Not null violation
      statusCode = 400;
      message = 'Required field missing';
    }
  }

  // Response format
  const errorResponse: any = {
    success: false,
    error: message,
  };

  // Include stack trace in development mode
  if (!isProduction && err.stack) {
    errorResponse.stack = err.stack;
  }

  res.status(statusCode).json(errorResponse);
}

/**
 * Handle 404 - Not Found
 */
export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.url} not found`,
  });
}

/**
 * Async error wrapper for route handlers
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
