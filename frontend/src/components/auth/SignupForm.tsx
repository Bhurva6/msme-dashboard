import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { validatePhone, validateEmail } from '@/utils/validation';
import axiosInstance from '@/api/axios.config';
import { SignupData, ApiResponse } from '@/types';
import LanguageSelector from './LanguageSelector';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuthStore } from '@/store/authStore';
import { User } from 'lucide-react';

export const SignupForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { login } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupData>();

  // Demo mode: Skip OTP and login directly
  const handleDemoLogin = async () => {
    setIsLoading(true);
    
    // Small delay for UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Create a demo user
    const demoUser: any = {
      id: 'demo-123',
      name: 'Demo User',
      phone: '9876543210',
      email: 'demo@msme.com',
    };
    
    // Create a fake token
    const demoToken = 'demo-token-' + Date.now();
    
    // Login the user
    login(demoToken, demoUser);
    
    // Navigate immediately to onboarding (before re-render)
    navigate('/onboarding', { replace: true });
    
    setIsLoading(false);
  };

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
      // If backend is not available, show demo option
      setError('Backend not available. Use Demo Mode to continue.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Language Selector */}
      <LanguageSelector />
      
      {/* Demo Mode Banner */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <User className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-bold text-blue-900 mb-1">🎮 Demo Mode Available</h3>
            <p className="text-xs text-blue-800 mb-2">
              Skip signup and explore the platform instantly with demo credentials
            </p>
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Loading...' : '🚀 Try Demo Mode'}
            </button>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or signup with your details</span>
        </div>
      </div>
      
      {error && (
        <div className="p-4 bg-danger-50 border border-danger-200 rounded-lg">
          <p className="text-sm text-danger-800">{error}</p>
        </div>
      )}

      <Input
        label={t('signup.name')}
        type="text"
        placeholder={t('signup.namePlaceholder')}
        required
        {...register('name', {
          required: 'Name is required',
          minLength: { value: 2, message: 'Name must be at least 2 characters' },
        })}
        error={errors.name?.message}
      />

      <Input
        label={t('signup.phone')}
        type="tel"
        placeholder={t('signup.phonePlaceholder')}
        required
        {...register('phone', {
          required: 'Phone number is required',
          validate: (value) =>
            validatePhone(value) || 'Please enter a valid 10-digit Indian phone number',
        })}
        error={errors.phone?.message}
      />

      <Input
        label={t('signup.email')}
        type="email"
        placeholder={t('signup.emailPlaceholder')}
        {...register('email', {
          validate: (value) =>
            !value || validateEmail(value) || 'Please enter a valid email address',
        })}
        error={errors.email?.message}
      />

      <Button type="submit" loading={isLoading} className="w-full">
        {t('signup.sendOtp')}
      </Button>

      <p className="text-sm text-center text-gray-600">
        {t('signup.alreadyHaveAccount')}{' '}
        <a href="/login" className="text-primary font-medium hover:underline">
          {t('signup.login')}
        </a>
      </p>
    </form>
  );
};
