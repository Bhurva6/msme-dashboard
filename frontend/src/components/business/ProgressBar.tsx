import React from 'react';
import { CompletionBreakdown } from '@/types';
import { CheckCircle2, Circle, AlertCircle } from 'lucide-react';

interface ProgressBarProps {
  completion: CompletionBreakdown;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ completion }) => {
  // Support both naming conventions - ensure defaults
  const directorKYC = completion.directorKYC || completion.kycDirectors || 0;
  const directorITR = completion.directorITR || completion.itrDirectors || 0;
  const overallCompletion = completion.overallCompletion ?? 0;

  const categories = [
    { key: 'businessInfo', label: 'Business Info', weight: completion.businessInfo.weight },
    { key: 'financials', label: 'Financial Documents (BS & P&L)', weight: completion.financials.weight },
    { key: 'sanctions', label: 'Sanction Letters', weight: completion.sanctions.weight },
    { key: 'businessProfile', label: 'Business Profile', weight: completion.businessProfile.weight },
    { key: 'directorKYC', label: 'Director KYC', weight: typeof directorKYC === 'object' ? directorKYC.weight : 0 },
    { key: 'directorITR', label: 'Director ITR', weight: typeof directorITR === 'object' ? directorITR.weight : 0 },
  ];

  const getStatusIcon = (completed: boolean) => {
    if (completed) {
      return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    }
    return <Circle className="w-5 h-5 text-gray-300" />;
  };

  const getStatusColor = (percentage: number) => {
    if (percentage >= 70) return 'bg-green-500';
    if (percentage >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusMessage = (percentage: number) => {
    if (percentage === 0) return 'Let\'s get started!';
    if (percentage < 30) return 'Just getting started';
    if (percentage < 50) return 'Making progress';
    if (percentage < 70) return 'Almost there!';
    if (percentage < 100) return 'Bank-ready profile!';
    return 'Profile Complete!';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      {/* Overall Progress */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">Profile Completion</h3>
          <span className="text-2xl font-bold text-blue-600">
            {overallCompletion}%
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
          <div
            className={`h-4 rounded-full transition-all duration-500 ${getStatusColor(overallCompletion)}`}
            style={{ width: `${overallCompletion}%` }}
          />
        </div>

        <p className="text-sm text-gray-600">{getStatusMessage(overallCompletion)}</p>

        {overallCompletion >= 70 && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-green-800">
                Congratulations! Your profile is bank-ready.
              </p>
              <p className="text-xs text-green-700 mt-1">
                You can now access funding options and submit loan requests.
              </p>
            </div>
          </div>
        )}

        {overallCompletion > 0 && overallCompletion < 70 && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-yellow-800">
                Complete {70 - overallCompletion}% more to unlock funding options
              </p>
              <p className="text-xs text-yellow-700 mt-1">
                Follow the checklist below to complete your profile.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Category Breakdown */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Completion Checklist</h4>
        <div className="space-y-3">
          {categories.map((category) => {
            const data = completion[category.key as keyof CompletionBreakdown] as any;
            return (
              <div key={category.key} className="flex items-center gap-3">
                {getStatusIcon(data.completed)}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm ${data.completed ? 'text-green-700 font-medium' : 'text-gray-700'}`}>
                      {category.label}
                    </span>
                    <span className="text-xs text-gray-500">
                      {data.percentage}% ({category.weight}% weight)
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        data.completed ? 'bg-green-500' : 'bg-blue-400'
                      }`}
                      style={{ width: `${data.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Next Steps */}
      {completion.nextSteps && completion.nextSteps.length > 0 && (
        <div className="border-t pt-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Next Steps</h4>
          <ul className="space-y-2">
            {completion.nextSteps.map((step: string, index: number) => (
              <li key={`step-${index}`} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-blue-500 font-semibold">{index + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
