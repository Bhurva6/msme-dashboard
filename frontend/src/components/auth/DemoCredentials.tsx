import React from 'react';
import { Info } from 'lucide-react';

interface DemoCredentialsProps {
  onUseDemoAccount: () => void;
}

export const DemoCredentials: React.FC<DemoCredentialsProps> = ({ onUseDemoAccount }) => {
  return (
    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">Demo Account</h3>
          <div className="text-sm text-blue-800 space-y-1">
            <p>
              <span className="font-medium">Email:</span> demo@msme.com
            </p>
            <p>
              <span className="font-medium">Password:</span> Demo@123
            </p>
          </div>
          <button
            type="button"
            onClick={onUseDemoAccount}
            className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
          >
            Use Demo Credentials →
          </button>
        </div>
      </div>
    </div>
  );
};
