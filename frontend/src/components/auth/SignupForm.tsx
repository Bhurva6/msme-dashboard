import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { validatePhone, validateEmail } from '@/utils/validation';
import axiosInstance from '@/api/axios.config';
import { SignupData, ApiResponse } from '@/types';

export const SignupForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<SignupData>();

  const onSubmit = async (data: SignupData) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await axiosInstance.post<ApiResponse>('/auth/signup', data);

      if (response.data.success) {
        // Store phone and name for OTP verification
        sessionStorage.setItem('signupPhone', data.phone);
        sessionStorage.setItem('signupName', data.name);
        if (data.email) {
          sessionStorage.setItem('signupEmail', data.email);
        }

        // Navigate to OTP verification
        navigate('/verify-otp', { state: { phone: data.phone } });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {error && (
        <div className="p-4 bg-danger-50 border border-danger-200 rounded-lg">
          <p className="text-sm text-danger-800">{error}</p>
        </div>
      )}

      <Input
        label="Full Name"
        type="text"
        placeholder="Enter your full name"
        required
        {...register('name', {
          required: 'Name is required',
          minLength: { value: 2, message: 'Name must be at least 2 characters' },
        })}
        error={errors.name?.message}
      />

      <Input
        label="Phone Number"
        type="tel"
        placeholder="Enter 10-digit mobile number"
        required
        {...register('phone', {
          required: 'Phone number is required',
          validate: (value) =>
            validatePhone(value) || 'Please enter a valid 10-digit Indian phone number',
        })}
        error={errors.phone?.message}
      />

      <Input
        label="Email (Optional)"
        type="email"
        placeholder="your.email@example.com"
        {...register('email', {
          validate: (value) =>
            !value || validateEmail(value) || 'Please enter a valid email address',
        })}
        error={errors.email?.message}
      />

      <Button type="submit" loading={isLoading} className="w-full">
        Send OTP
      </Button>

      <p className="text-sm text-center text-gray-600">
        Already have an account?{' '}
        <a href="/login" className="text-primary font-medium hover:underline">
          Login
        </a>
      </p>
    </form>
  );
};
