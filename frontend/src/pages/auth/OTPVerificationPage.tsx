import React from 'react';
import { OTPVerification } from '@/components/auth/OTPVerification';

export const OTPVerificationPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-3xl">M</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Verify Your Phone
          </h2>
          <p className="text-gray-600">
            We've sent a 6-digit OTP to your mobile number
          </p>
        </div>

        <div className="card">
          <OTPVerification />
        </div>
      </div>
    </div>
  );
};
