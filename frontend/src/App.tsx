import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { ToastContainer } from './components/common/Toast';
import { LandingPage } from './pages/LandingPage';
import { SignupPage } from './pages/auth/SignupPage';
import { LoginPage } from './pages/auth/LoginPage';
import { OTPVerificationPage } from './pages/auth/OTPVerificationPage';
import { ProfilePage } from './pages/dashboard/ProfilePage';
import BusinessSetupPage from './pages/business/BusinessSetupPage';
import BusinessProfilePage from './pages/dashboard/BusinessProfilePage';
import FundingOptionsPage from './pages/funding/FundingOptionsPage';
import OnboardingPage from './pages/onboarding/OnboardingPage';
import OnboardingQuestionsPage from './pages/onboarding/OnboardingQuestionsPage';
import SchemesPage from './pages/onboarding/SchemesPage';
import { useAuthStore } from './store/authStore';
import { ToastMessage } from './types';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import LanguageLoader from './components/common/LanguageLoader';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (isAuthenticated) {
    return <>{children}</>;
  }
  
  return <Navigate to="/login" replace />;
};

// Public Only Route (redirect to onboarding if already logged in, to allow demo flow)
const PublicOnlyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (isAuthenticated) {
    return <Navigate to="/onboarding" replace />;
  }
  
  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const { isChangingLanguage } = useLanguage();
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: ToastMessage['type']) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // Make addToast available globally (optional)
  (globalThis as any).addToast = addToast;

  // Show language loader when changing language
  if (isChangingLanguage) {
    return <LanguageLoader />;
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Auth Routes - Redirect to dashboard if logged in */}
            <Route
              path="/signup"
              element={
                <PublicOnlyRoute>
                  <SignupPage />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/login"
              element={
                <PublicOnlyRoute>
                  <LoginPage />
                </PublicOnlyRoute>
              }
            />
            <Route path="/verify-otp" element={<OTPVerificationPage />} />
            
            {/* Onboarding Routes - Protected */}
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute>
                  <OnboardingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/onboarding/questions"
              element={
                <ProtectedRoute>
                  <OnboardingQuestionsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/onboarding/schemes"
              element={
                <ProtectedRoute>
                  <SchemesPage />
                </ProtectedRoute>
              }
            />
            
            {/* Protected Routes */}
            <Route
              path="/business/setup"
              element={
                <ProtectedRoute>
                  <BusinessSetupPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <BusinessProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/funding"
              element={
                <ProtectedRoute>
                  <FundingOptionsPage />
                </ProtectedRoute>
              }
            />
            
            {/* 404 - Redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        {/* Toast Notifications */}
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </div>
    </Router>
  );
};

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
