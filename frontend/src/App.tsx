import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { api } from './api/api';
import { SetupPage } from './pages/SetupPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { SessionPage } from './pages/SessionPage';
import { SettingsPage } from './pages/SettingsPage';
import { TemplatesPage } from './pages/TemplatesPage';
import { Toast } from './components/Toast';
import { ConfirmDialog } from './components/ConfirmDialog';

function App() {
  const [setupRequired, setSetupRequired] = useState<boolean | null>(null);
  const { token } = useAuthStore();

  useEffect(() => {
    void (async () => {
      try {
        const data = await api.checkSetupStatus() as { setupRequired: boolean };
        setSetupRequired(data.setupRequired);
      } catch {
        setSetupRequired(false);
      }
    })();
  }, []);

  if (setupRequired === null) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
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

  if (!token) {
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
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Toast />
      <ConfirmDialog />
    </BrowserRouter>
  );
}

export default App;
