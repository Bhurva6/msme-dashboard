/**
 * Validation utility functions
 */

/**
 * Validate Indian phone number (10 digits, starts with 6-9)
 */
export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password (min 8 chars, at least 1 number, 1 letter)
 */
export function validatePassword(password: string): boolean {
  if (password.length < 8) {
    return false;
  }
  
  const hasNumber = /\d/.test(password);
  const hasLetter = /[a-zA-Z]/.test(password);
  
  return hasNumber && hasLetter;
}

/**
 * Sanitize input to remove potentially malicious characters
 */
export function sanitizeInput(input: string): string {
  // Remove HTML tags and special characters that could be used for XSS
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/[<>'"]/g, '')
    .trim();
}

/**
 * Validate OTP format (6 digits)
 */
export function validateOTP(otp: string): boolean {
  const otpRegex = /^\d{6}$/;
  return otpRegex.test(otp);
}
