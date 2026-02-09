import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check, TrendingUp, Users, Building2, Zap, Award, ArrowRight, X } from 'lucide-react';

interface Scheme {
  id: string;
  name: string;
  description: string;
  matchPercentage: number;
  benefits: string[];
  eligibility: string[];
  fundingAmount: string;
  icon: React.ReactNode;
  category: string;
}

const dummySchemes: Scheme[] = [
  {
    id: '1',
    name: 'MUDRA Loan Scheme',
    description: 'Micro Units Development and Refinance Agency provides loans up to ₹10 lakh for small businesses',
    matchPercentage: 95,
    benefits: [
      'No collateral required',
      'Low interest rates (7-12%)',
      'Flexible repayment tenure',
      'Quick processing'
    ],
    eligibility: [
      'Manufacturing or trading business',
      'Turnover under ₹5 crore',
      'Business should not be defaulter'
    ],
    fundingAmount: '₹50,000 - ₹10 Lakh',
    icon: <TrendingUp className="w-8 h-8" />,
    category: 'Working Capital'
  },
  {
    id: '2',
    name: 'Stand Up India',
    description: 'Facilitates bank loans between ₹10 lakh and ₹1 crore for SC/ST and women entrepreneurs',
    matchPercentage: 88,
    benefits: [
      'Loans between ₹10L to ₹1Cr',
      'Special benefits for women',
      'Lower interest rates',
      'Credit guarantee coverage'
    ],
    eligibility: [
      'Woman entrepreneur or SC/ST category',
      'First-time entrepreneur',
      'Manufacturing or service business'
    ],
    fundingAmount: '₹10 Lakh - ₹1 Crore',
    icon: <Users className="w-8 h-8" />,
    category: 'Business Setup'
  },
  {
    id: '3',
    name: 'CLCSS Scheme',
    description: 'Credit Linked Capital Subsidy for technology upgradation in MSMEs',
    matchPercentage: 82,
    benefits: [
      '15% capital subsidy on machinery',
      'Up to ₹15 lakh subsidy',
      'Modern technology adoption',
      'Increased productivity'
    ],
    eligibility: [
      'Manufacturing MSME',
      'Purchasing new machinery',
      'Technology upgrade required'
    ],
    fundingAmount: 'Up to ₹15 Lakh Subsidy',
    icon: <Zap className="w-8 h-8" />,
    category: 'Technology'
  },
  {
    id: '4',
    name: 'PMEGP Scheme',
    description: 'Prime Minister Employment Generation Programme for new enterprise setup',
    matchPercentage: 79,
    benefits: [
      '15-35% subsidy on project cost',
      'Up to ₹25 lakh for manufacturing',
      'Training support provided',
      'Marketing assistance'
    ],
    eligibility: [
      'New business setup',
      'Above 18 years age',
      'Not availed subsidy before'
    ],
    fundingAmount: 'Up to ₹25 Lakh (Manufacturing)',
    icon: <Building2 className="w-8 h-8" />,
    category: 'New Business'
  },
  {
    id: '5',
    name: 'CGS Scheme',
    description: 'Credit Guarantee Scheme provides collateral-free credit to MSMEs',
    matchPercentage: 91,
    benefits: [
      'Collateral-free loans',
      'Up to ₹2 crore guarantee',
      '75-85% guarantee coverage',
      'Easy loan approval'
    ],
    eligibility: [
      'Registered MSME',
      'Valid business operations',
      'Good credit history'
    ],
    fundingAmount: 'Up to ₹2 Crore',
    icon: <Award className="w-8 h-8" />,
    category: 'Credit Guarantee'
  },
  {
    id: '6',
    name: 'Startup India Seed Fund',
    description: 'Financial assistance to startups for proof of concept and product development',
    matchPercentage: 75,
    benefits: [
      'Up to ₹20 lakh seed funding',
      'No equity dilution',
      'Mentorship support',
      'Networking opportunities'
    ],
    eligibility: [
      'DPIIT recognized startup',
      'Incorporated less than 2 years',
      'Technology-based business'
    ],
    fundingAmount: 'Up to ₹20 Lakh',
    icon: <Zap className="w-8 h-8" />,
    category: 'Startup'
  }
];

const SchemesPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const answers = location.state?.answers;
  
  const [selectedSchemes, setSelectedSchemes] = useState<string[]>([]);
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);

  // Sort schemes by match percentage
  const sortedSchemes = [...dummySchemes].sort((a, b) => b.matchPercentage - a.matchPercentage);

  const toggleScheme = (schemeId: string) => {
    setSelectedSchemes(prev =>
      prev.includes(schemeId)
        ? prev.filter(id => id !== schemeId)
        : [...prev, schemeId]
    );
  };

  const handleContinue = () => {
    navigate('/business/setup');
  };

  const getMatchColor = (percentage: number) => {
    if (percentage >= 85) return 'text-green-600 bg-green-100';
    if (percentage >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-orange-600 bg-orange-100';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {answers ? 'Recommended' : 'All'} Government Schemes
          </h1>
          <p className="text-xl text-gray-600">
            {answers
              ? 'Based on your answers, here are the best matches for your business'
              : 'Browse all available schemes and select the ones that fit your needs'}
          </p>
          {selectedSchemes.length > 0 && (
            <p className="text-sm text-blue-600 font-medium mt-2">
              {selectedSchemes.length} scheme(s) selected
            </p>
          )}
        </div>

        {/* Schemes Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {sortedSchemes.map((scheme) => (
            <div
              key={scheme.id}
              className={`bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition-all hover:scale-105 hover:shadow-xl ${
                selectedSchemes.includes(scheme.id) ? 'ring-4 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedScheme(scheme)}
            >
              {/* Match Badge */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
                <div className="flex items-center justify-between mb-2">
                  <div className="bg-white bg-opacity-20 rounded-lg p-2">
                    {scheme.icon}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${getMatchColor(scheme.matchPercentage)}`}>
                    {scheme.matchPercentage}% Match
                  </span>
                </div>
                <h3 className="text-xl font-bold">{scheme.name}</h3>
                <p className="text-xs text-blue-100 mt-1">{scheme.category}</p>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-600 text-sm mb-4">{scheme.description}</p>
                
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Funding Amount:</p>
                  <p className="text-lg font-bold text-blue-600">{scheme.fundingAmount}</p>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Key Benefits:</p>
                  <ul className="space-y-1">
                    {scheme.benefits.slice(0, 2).map((benefit, idx) => (
                      <li key={idx} className="text-xs text-gray-600 flex items-start">
                        <Check className="w-3 h-3 text-green-500 mr-1 mt-0.5 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Select Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleScheme(scheme.id);
                  }}
                  className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors ${
                    selectedSchemes.includes(scheme.id)
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {selectedSchemes.includes(scheme.id) ? (
                    <span className="flex items-center justify-center gap-2">
                      <Check className="w-4 h-4" /> Selected
                    </span>
                  ) : (
                    'Select Scheme'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Continue Button */}
        <div className="flex justify-center">
          <button
            onClick={handleContinue}
            className="flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg"
          >
            Continue to Profile Setup
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Scheme Detail Modal */}
      {selectedScheme && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white sticky top-0">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{selectedScheme.name}</h2>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${getMatchColor(selectedScheme.matchPercentage)}`}>
                    {selectedScheme.matchPercentage}% Match
                  </span>
                </div>
                <button
                  onClick={() => setSelectedScheme(null)}
                  className="bg-white bg-opacity-20 rounded-full p-2 hover:bg-opacity-30 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <p className="text-gray-700 mb-6">{selectedScheme.description}</p>

              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Funding Amount</h3>
                <p className="text-2xl font-bold text-blue-600">{selectedScheme.fundingAmount}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Key Benefits</h3>
                <ul className="space-y-2">
                  {selectedScheme.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Eligibility Criteria</h3>
                <ul className="space-y-2">
                  {selectedScheme.eligibility.map((criteria, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-3 mt-2 flex-shrink-0" />
                      <span className="text-gray-700">{criteria}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    toggleScheme(selectedScheme.id);
                    setSelectedScheme(null);
                  }}
                  className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors ${
                    selectedSchemes.includes(selectedScheme.id)
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {selectedSchemes.includes(selectedScheme.id) ? 'Unselect' : 'Select This Scheme'}
                </button>
                <button
                  onClick={() => setSelectedScheme(null)}
                  className="px-6 py-3 rounded-lg font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchemesPage;
