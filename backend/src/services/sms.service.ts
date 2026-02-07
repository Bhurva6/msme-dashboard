import { generateOTP } from '../utils/otp.generator';

/**
 * OTP storage interface
 */
interface OTPData {
  otp: string;
  expiresAt: number;
  attempts: number;
}

/**
 * Rate limiting interface
 */
interface RateLimit {
  count: number;
  resetAt: number;
}

/**
 * SMS Service for OTP generation and verification
 */
export class SMSService {
  private static otpStore = new Map<string, OTPData>();
  private static rateLimitStore = new Map<string, RateLimit>();
  
  // OTP expires in 10 minutes
  private static OTP_EXPIRY_MS = 10 * 60 * 1000;
  
  // Rate limit: max 3 OTPs per hour
  private static MAX_OTP_PER_HOUR = 3;
  private static RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
  
  // Max verification attempts
  private static MAX_VERIFY_ATTEMPTS = 3;

  /**
   * Check rate limit for phone number
   */
  private static checkRateLimit(phone: string): boolean {
    const now = Date.now();
    const rateLimit = this.rateLimitStore.get(phone);

    if (!rateLimit) {
      this.rateLimitStore.set(phone, {
        count: 1,
        resetAt: now + this.RATE_LIMIT_WINDOW_MS,
      });
      return true;
    }

    // Reset if window expired
    if (now > rateLimit.resetAt) {
      this.rateLimitStore.set(phone, {
        count: 1,
        resetAt: now + this.RATE_LIMIT_WINDOW_MS,
      });
      return true;
    }

    // Check if limit exceeded
    if (rateLimit.count >= this.MAX_OTP_PER_HOUR) {
      return false;
    }

    // Increment count
    rateLimit.count++;
    return true;
  }

  /**
   * Generate and send OTP to phone number
   */
  static async sendOTP(phone: string): Promise<{ success: boolean; message: string }> {
    try {
      // Check rate limit
      if (!this.checkRateLimit(phone)) {
        return {
          success: false,
          message: 'Too many OTP requests. Please try again after an hour.',
        };
      }

      // Generate OTP
      const otp = generateOTP();
      const expiresAt = Date.now() + this.OTP_EXPIRY_MS;

      // Store OTP
      this.otpStore.set(phone, {
        otp,
        expiresAt,
        attempts: 0,
      });

      // TODO: Integrate with Twilio or other SMS service
      // For now, log to console (development mode)
      console.log(`📱 OTP for ${phone}: ${otp}`);
      console.log(`⏰ Expires at: ${new Date(expiresAt).toLocaleString()}`);

      return {
        success: true,
        message: 'OTP sent successfully',
      };
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw error;
    }
  }

  /**
   * Verify OTP for phone number
   */
  static verifyOTP(phone: string, otp: string): { success: boolean; message: string } {
    const otpData = this.otpStore.get(phone);

    // Check if OTP exists
    if (!otpData) {
      return {
        success: false,
        message: 'No OTP found for this phone number. Please request a new OTP.',
      };
    }

    // Check if OTP expired
    if (Date.now() > otpData.expiresAt) {
      this.otpStore.delete(phone);
      return {
        success: false,
        message: 'OTP has expired. Please request a new OTP.',
      };
    }

    // Check max attempts
    if (otpData.attempts >= this.MAX_VERIFY_ATTEMPTS) {
      this.otpStore.delete(phone);
      return {
        success: false,
        message: 'Maximum verification attempts exceeded. Please request a new OTP.',
      };
    }

    // Increment attempts
    otpData.attempts++;

    // Verify OTP
    if (otpData.otp !== otp) {
      return {
        success: false,
        message: `Invalid OTP. ${this.MAX_VERIFY_ATTEMPTS - otpData.attempts} attempts remaining.`,
      };
    }

    // OTP verified successfully, remove from store
    this.otpStore.delete(phone);
    return {
      success: true,
      message: 'OTP verified successfully',
    };
  }

  /**
   * Clear expired OTPs (cleanup job)
   */
  static clearExpiredOTPs(): void {
    const now = Date.now();
    
    for (const [phone, otpData] of this.otpStore.entries()) {
      if (now > otpData.expiresAt) {
        this.otpStore.delete(phone);
      }
    }

    for (const [phone, rateLimit] of this.rateLimitStore.entries()) {
      if (now > rateLimit.resetAt) {
        this.rateLimitStore.delete(phone);
      }
    }
  }
}

// Run cleanup every 5 minutes
setInterval(() => {
  SMSService.clearExpiredOTPs();
}, 5 * 60 * 1000);
