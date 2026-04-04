import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from './stores/authStore';
import { api } from './api/api';
import { applyAccentColor, getStoredAccentColor } from './utils/accentColors.js';
import { SetupPage } from './pages/SetupPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { SessionPage } from './pages/SessionPage';
import { SettingsPage } from './pages/SettingsPage';
import { TemplatesPage } from './pages/TemplatesPage';
import { AboutPage } from './pages/AboutPage';
import { BuilderPage } from './pages/BuilderPage';
import { Toast } from './components/Toast';
import { ConfirmDialog } from './components/ConfirmDialog';

function App() {
  const [setupRequired, setSetupRequired] = useState<boolean | null>(null);
  const { token, user, initializeAuth } = useAuthStore();
  const { t } = useTranslation();

  const checkSetup = async () => {
    try {
      const data = await api.checkSetupStatus() as { setupRequired: boolean };
      setSetupRequired(data.setupRequired);
    } catch {
      setSetupRequired(false);
    }
  };

  useEffect(() => {
    initializeAuth();
    applyAccentColor(getStoredAccentColor());
    void checkSetup();
  }, [initializeAuth]);

  // Re-check setup when token changes (after successful setup/login)
  useEffect(() => {
    if (token) {
      void checkSetup();
    }
  }, [token]);

  if (setupRequired === null) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{t('common:loading')}</div>;
  }

  if (setupRequired) {
    return (
      <BrowserRouter>
        <SetupPage />
        <Toast />
        <ConfirmDialog />
      </BrowserRouter>
    );
  }

  if (!token || !user) {
    return (
      <BrowserRouter>
        <LoginPage />
        <Toast />
        <ConfirmDialog />
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/session/:id" element={<SessionPage />} />
        <Route path="/templates" element={<TemplatesPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/builder" element={<BuilderPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Toast />
      <ConfirmDialog />
    </BrowserRouter>
  );
}

export default App;
