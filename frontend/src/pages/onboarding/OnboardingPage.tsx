import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, HelpCircle, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleKnowSchemes = () => {
    navigate('/onboarding/schemes');
  };

  const handleNeedHelp = () => {
    navigate('/onboarding/questions');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('onboarding.welcome')}
          </h1>
          <p className="text-xl text-gray-600">
            {t('onboarding.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Option 1: I Know About Schemes */}
          <div
            onClick={handleKnowSchemes}
            className="bg-white rounded-2xl shadow-xl p-8 cursor-pointer transform transition-all hover:scale-105 hover:shadow-2xl border-2 border-transparent hover:border-blue-500"
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-100 rounded-full p-6 mb-6">
                <CheckCircle className="w-12 h-12 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t('onboarding.knowSchemes')}
              </h2>
              <p className="text-gray-600 mb-6">
                {t('onboarding.knowSchemesDesc')}
              </p>
              <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                {t('onboarding.browseSchemes')}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Option 2: Help Me Find Schemes */}
          <div
            onClick={handleNeedHelp}
            className="bg-white rounded-2xl shadow-xl p-8 cursor-pointer transform transition-all hover:scale-105 hover:shadow-2xl border-2 border-transparent hover:border-green-500"
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-green-100 rounded-full p-6 mb-6">
                <HelpCircle className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t('onboarding.needHelp')}
              </h2>
              <p className="text-gray-600 mb-6">
                {t('onboarding.needHelpDesc')}
              </p>
              <button className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                {t('onboarding.getMatched')}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
