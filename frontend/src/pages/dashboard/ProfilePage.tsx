import React from 'react';
import { useAuthStore } from '@/store/authStore';
import { User, Phone, Mail, Shield } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

        {/* User Info Card */}
        <div className="card mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
              <p className="text-gray-600 capitalize">{user?.role} Account</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Phone className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Phone Number</p>
                <p className="font-medium text-gray-900">+91 {user?.phone}</p>
              </div>
            </div>

            {user?.email && (
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">{user.email}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Shield className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Account Type</p>
                <p className="font-medium text-gray-900 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="card bg-gradient-to-br from-primary-50 to-secondary-50 border-2 border-primary-100">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Welcome to MSME Funding Platform! 🎉
          </h3>
          <p className="text-gray-600 mb-4">
            Your profile has been created successfully. The complete business profile features will be available soon.
          </p>
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Coming Soon:</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>Complete business profile setup</li>
              <li>Document upload and management</li>
              <li>Funding application tracking</li>
              <li>Lender matching</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
