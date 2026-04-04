import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../stores/authStore';
import { useUIStore } from '../stores/uiStore';
import { api } from '../api/api';

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { t, i18n } = useTranslation();
  const { setAuth } = useAuthStore();
  const { addToast } = useUIStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await api.login(username, password) as { user: { language: string }; token: string };
      setAuth(res.user as Parameters<typeof setAuth>[0], res.token);
      void i18n.changeLanguage((res.user as { language: string }).language);
      navigate('/');
    } catch {
      addToast('error', t('ui:login.errorInvalid'));
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg-secondary)' }}>
      <div className="card" style={{ width: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-lg)' }}>
          <img src="/logo.png" alt="HELDEVTEST" style={{ height: '64px', marginBottom: 'var(--space-md)' }} />
          <h1>{t('ui:login.title')}</h1>
        </div>

        <form onSubmit={(e) => { void handleSubmit(e); }}>
          <div style={{ marginBottom: 'var(--space-md)' }}>
            <label style={{ display: 'block', marginBottom: 'var(--space-sm)' }}>
              {t('ui:login.username')}
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: 'var(--space-lg)' }}>
            <label style={{ display: 'block', marginBottom: 'var(--space-sm)' }}>
              {t('ui:login.password')}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%' }}
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%' }}>
            {t('ui:login.loginButton')}
          </button>
        </form>
      </div>
    </div>
  );
}
