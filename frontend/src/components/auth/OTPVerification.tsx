import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../common/Button';
import axiosInstance from '@/api/axios.config';
import { useAuthStore } from '@/store/authStore';
import { ApiResponse, User } from '@/types';

export const OTPVerification: React.FC = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const phone = location.state?.phone || sessionStorage.getItem('signupPhone') || '';
  const name = sessionStorage.getItem('signupName') || '';
  const email = sessionStorage.getItem('signupEmail') || '';

  useEffect(() => {
    if (!phone) {
      navigate('/signup');
    }
  }, [phone, navigate]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      setError('Please enter complete OTP');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await axiosInstance.post<ApiResponse<{ token: string; user: User }>>('/auth/verify-otp', {
        phone,
        otp: otpString,
        name,
        email,
      });

      if (response.data.success && response.data.data) {
        const { token, user } = response.data.data;
        login(token, user);
        
        // Clear session storage
        sessionStorage.removeItem('signupPhone');
        sessionStorage.removeItem('signupName');
        sessionStorage.removeItem('signupEmail');

        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid OTP. Please try again.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    setIsLoading(true);
    setError('');

    try {
      await axiosInstance.post('/auth/resend-otp', { phone });
      setCountdown(60);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      setError(err.message || 'Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-danger-50 border border-danger-200 rounded-lg">
          <p className="text-sm text-danger-800">{error}</p>
        </div>
      )}

      <div className="text-center">
        <p className="text-gray-600">
          Enter the 6-digit OTP sent to
        </p>
        <p className="font-semibold text-gray-900 mt-1">+91 {phone}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center gap-2 sm:gap-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-semibold border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none transition-all"
              autoFocus={index === 0}
            />
          ))}
        </div>

        <Button type="submit" loading={isLoading} className="w-full">
          Verify OTP
        </Button>
      </form>

      <div className="text-center">
        {canResend ? (
          <button
            onClick={handleResendOTP}
            disabled={isLoading}
            className="text-primary font-medium hover:underline disabled:opacity-50"
          >
            Resend OTP
          </button>
        ) : (
          <p className="text-gray-600">
            Resend OTP in <span className="font-semibold text-primary">{countdown}s</span>
          </p>
        )}
      </div>
    </div>
  );
};
