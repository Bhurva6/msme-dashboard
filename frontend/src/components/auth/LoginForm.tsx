import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { DemoCredentials } from './DemoCredentials';
import { validateEmail } from '@/utils/validation';
import axiosInstance from '@/api/axios.config';
import { useAuthStore } from '@/store/authStore';
import { LoginData, ApiResponse, User } from '@/types';

export const LoginForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginData>();

  const useDemoAccount = () => {
    setValue('email', 'demo@msme.com');
    setValue('password', 'Demo@123');
  };

  const onSubmit = async (data: LoginData) => {
    setIsLoading(true);
    setError('');

    try {
      // Check if demo credentials are being used (mock login)
      if (data.email === 'demo@msme.com' && data.password === 'Demo@123') {
        // Mock successful login
        const mockUser: User = {
          id: 'demo-user-123',
          name: 'Demo User',
          email: 'demo@msme.com',
          phone: '9876543210',
          role: 'owner',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        const mockToken = 'demo-jwt-token-' + Date.now();
        
        // Store in authStore
        login(mockToken, mockUser);
        
        // Navigate to dashboard
        setTimeout(() => {
          navigate('/dashboard');
        }, 500);
        
        return;
      }

      // Try API login (will fail if backend not available)
      const response = await axiosInstance.post<ApiResponse<{ token: string; user: User }>>('/auth/login', data);

      if (response.data.success && response.data.data) {
        const { token, user } = response.data.data;
        login(token, user);
        navigate('/dashboard');
      }
    } catch (err: any) {
      // If it's a network error and not demo credentials, show helpful message
      if (err.message?.includes('Network Error') || err.code === 'ERR_CONNECTION_REFUSED') {
        setError('Backend API not available. Try demo credentials: demo@msme.com / Demo@123');
      } else {
        setError(err.message || 'Invalid credentials. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <DemoCredentials onUseDemoAccount={useDemoAccount} />
      
      {error && (
        <div className="p-4 bg-danger-50 border border-danger-200 rounded-lg">
          <p className="text-sm text-danger-800">{error}</p>
        </div>
      )}

      <Input
        label="Email"
        type="email"
        placeholder="your.email@example.com"
        required
        {...register('email', {
          required: 'Email is required',
          validate: (value) => validateEmail(value) || 'Please enter a valid email address',
        })}
        error={errors.email?.message}
      />

      <div className="relative">
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Enter your password"
          required
          {...register('password', {
            required: 'Password is required',
          })}
          error={errors.password?.message}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2">
          <input type="checkbox" className="rounded border-gray-300" />
          <span className="text-sm text-gray-600">Remember me</span>
        </label>
        <Link to="/forgot-password" className="text-sm text-primary hover:underline">
          Forgot Password?
        </Link>
      </div>

      <Button type="submit" loading={isLoading} className="w-full">
        Login
      </Button>

      <p className="text-sm text-center text-gray-600">
        Don't have an account?{' '}
        <Link to="/signup" className="text-primary font-medium hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  );
};
