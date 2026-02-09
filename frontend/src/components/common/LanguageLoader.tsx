import React from 'react';
import { Globe } from 'lucide-react';

const LanguageLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative inline-block mb-6">
          <Globe className="w-20 h-20 text-blue-600 animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Changing language...
        </h2>
        <p className="text-gray-600">
          Please wait while we translate the app for you
        </p>
      </div>
    </div>
  );
};

export default LanguageLoader;
