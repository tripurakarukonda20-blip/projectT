import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { LoadingState } from './components/LoadingState';

// Pages
import { LandingPage } from './pages/LandingPage';
import { RegisterPage } from './pages/RegisterPage';
import { LoginPage } from './pages/LoginPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { InterviewSetupPage } from './pages/InterviewSetupPage';
import { LiveInterviewPage } from './pages/LiveInterviewPage';
import { FinalReportPage } from './pages/FinalReportPage';
import { HistoryPage } from './pages/HistoryPage';
import { StudyPlanPage } from './pages/StudyPlanPage';
import { ProfilePage } from './pages/ProfilePage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingState message="Verifying authentication session..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Pages */}
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <OnboardingPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/interview/new"
        element={
          <ProtectedRoute>
            <InterviewSetupPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/interview/:id"
        element={
          <ProtectedRoute>
            <LiveInterviewPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/interview/:id/result"
        element={
          <ProtectedRoute>
            <FinalReportPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <HistoryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/study-plan"
        element={
          <ProtectedRoute>
            <StudyPlanPage />
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

      {/* Fallback Catch-all Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
