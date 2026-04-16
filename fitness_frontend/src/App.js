import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import OnboardingPage from "./pages/OnboardingPage";
import ProfilePage from "./pages/ProfilePage";
import DashboardPage from "./pages/DashboardPage";
import WorkoutsPage from "./pages/WorkoutsPage";
import SchedulerPage from "./pages/SchedulerPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import NotificationsPage from "./pages/NotificationsPage";
import AdminPage from "./pages/AdminPage";
import { AppProvider, useApp } from "./state/AppState";
import ApiDocsHelpPage from "./pages/ApiDocsHelpPage";

/**
 * Simple gate: in this template, onboarding completion is stored locally.
 * If your backend has auth/session, wire this to real auth state.
 */
function RequireOnboarded({ children }) {
  const { state } = useApp();
  if (!state.onboarding.completed) return <Navigate to="/onboarding" replace />;
  return children;
}

function RequireAdmin({ children }) {
  const { state } = useApp();
  if (!state.user.isAdmin) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route
            path="/"
            element={
              <RequireOnboarded>
                <AppLayout />
              </RequireOnboarded>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="workouts" element={<WorkoutsPage />} />
            <Route path="scheduler" element={<SchedulerPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="api-help" element={<ApiDocsHelpPage />} />
            <Route
              path="admin"
              element={
                <RequireAdmin>
                  <AdminPage />
                </RequireAdmin>
              }
            />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
