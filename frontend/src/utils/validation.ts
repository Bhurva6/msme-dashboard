/**
 * Validate Indian phone number (10 digits, starts with 6-9)
 */
export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
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
 * Validate OTP (6 digits)
 */
export function validateOTP(otp: string): boolean {
  const otpRegex = /^\d{6}$/;
  return otpRegex.test(otp);
}

/**
 * Get password strength
 */
export function getPasswordStrength(password: string): {
  strength: 'weak' | 'medium' | 'strong';
  message: string;
} {
  if (password.length < 8) {
    return { strength: 'weak', message: 'Too short' };
  }

  let score = 0;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  if (password.length >= 12) score++;

  if (score < 3) {
    return { strength: 'weak', message: 'Weak password' };
  } else if (score < 4) {
    return { strength: 'medium', message: 'Medium strength' };
  } else {
    return { strength: 'strong', message: 'Strong password' };
  }
}
