import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Question {
  id: number;
  questionKey: string;
  options: { value: string; labelKey: string }[];
}

const getQuestions = (): Question[] => [
  {
    id: 1,
    questionKey: "questions.q1",
    options: [
      { value: "manufacturing", labelKey: "questions.q1.manufacturing" },
      { value: "service", labelKey: "questions.q1.service" },
      { value: "trading", labelKey: "questions.q1.trading" },
      { value: "technology", labelKey: "questions.q1.technology" },
    ],
  },
  {
    id: 2,
    questionKey: "questions.q2",
    options: [
      { value: "under-5cr", labelKey: "questions.q2.under5" },
      { value: "5-50cr", labelKey: "questions.q2.5to50" },
      { value: "50-100cr", labelKey: "questions.q2.50to100" },
      { value: "above-100cr", labelKey: "questions.q2.above100" },
    ],
  },
  {
    id: 3,
    questionKey: "questions.q3",
    options: [
      { value: "under-10", labelKey: "questions.q3.under10" },
      { value: "10-50", labelKey: "questions.q3.10to50" },
      { value: "50-100", labelKey: "questions.q3.50to100" },
      { value: "above-100", labelKey: "questions.q3.above100" },
    ],
  },
  {
    id: 4,
    questionKey: "questions.q4",
    options: [
      { value: "working-capital", labelKey: "questions.q4.workingCapital" },
      { value: "machinery", labelKey: "questions.q4.machinery" },
      { value: "expansion", labelKey: "questions.q4.expansion" },
      { value: "technology", labelKey: "questions.q4.technology" },
    ],
  },
  {
    id: 5,
    questionKey: "questions.q5",
    options: [
      { value: "woman", labelKey: "questions.q5.woman" },
      { value: "sc-st", labelKey: "questions.q5.scst" },
      { value: "minority", labelKey: "questions.q5.minority" },
      { value: "general", labelKey: "questions.q5.general" },
    ],
  },
];

const OnboardingQuestionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const questions = getQuestions();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [questions[currentQuestion].id]: value });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Navigate to schemes page with answers
      navigate('/onboarding/schemes', { state: { answers } });
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const isAnswered = answers[questions[currentQuestion].id] !== undefined;
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              {t('questions.questionOf')
                .replace('{current}', String(currentQuestion + 1))
                .replace('{total}', String(questions.length))}
            </span>
            <span className="text-sm font-medium text-gray-600">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            {t(questions[currentQuestion].questionKey)}
          </h2>

          <div className="space-y-4">
            {questions[currentQuestion].options.map((option) => (
              <label
                key={option.value}
                className={`block cursor-pointer transition-all ${
                  answers[questions[currentQuestion].id] === option.value
                    ? 'ring-2 ring-blue-500'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center p-4 border-2 border-gray-200 rounded-lg">
                  <input
                    type="radio"
                    name={`question-${questions[currentQuestion].id}`}
                    value={option.value}
                    checked={answers[questions[currentQuestion].id] === option.value}
                    onChange={() => handleAnswer(option.value)}
                    className="w-5 h-5 text-blue-600"
                  />
                  <span className="ml-4 text-lg text-gray-700">{t(option.labelKey)}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={handleBack}
            disabled={currentQuestion === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
              currentQuestion === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
            {t('common.back')}
          </button>

          <button
            onClick={handleNext}
            disabled={!isAnswered}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
              !isAnswered
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {currentQuestion === questions.length - 1 ? t('questions.viewSchemes') : t('common.next')}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingQuestionsPage;
