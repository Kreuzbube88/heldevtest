import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../stores/authStore';
import { useUIStore } from '../stores/uiStore';
import { api } from '../api/api';
import { ThemeSwitcher } from '../components/ThemeSwitcher';
import { LogIn } from 'lucide-react';

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { t, i18n } = useTranslation();
  const { setAuth } = useAuthStore();
  const { addToast } = useUIStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await api.login(username, password) as { user: { language: string }; token: string };
      setAuth(res.user as Parameters<typeof setAuth>[0], res.token);
      void i18n.changeLanguage((res.user as { language: string }).language);
      window.location.href = '/';
    } catch {
      addToast('error', t('ui:login.errorInvalid'));
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      background: 'var(--color-bg-primary)',
    }}>
      {/* Ambient gradient */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse 80% 60% at 20% 10%, rgba(102, 126, 234, 0.12) 0%, transparent 60%), radial-gradient(ellipse 60% 60% at 80% 90%, rgba(118, 75, 162, 0.12) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />

      {/* Theme toggle */}
      <div style={{ position: 'absolute', top: 'var(--space-lg)', right: 'var(--space-lg)', zIndex: 10 }}>
        <ThemeSwitcher />
      </div>

      {/* Card */}
      <div
        className="card animate-scaleIn"
        style={{ width: '400px', maxWidth: 'calc(100vw - 32px)', position: 'relative', zIndex: 1 }}
      >
        {/* Large logo */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
          <img
            src="/logo.png"
            alt="HELDEVTEST"
            style={{ width: '240px', maxWidth: '100%', height: 'auto', display: 'block', margin: '0 auto' }}
          />
        </div>

        <form onSubmit={(e) => { void handleSubmit(e); }}>
          <div style={{ marginBottom: 'var(--space-md)' }}>
            <label>{t('ui:login.username')}</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div style={{ marginBottom: 'var(--space-xl)' }}>
            <label>{t('ui:login.password')}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%' }}>
            <LogIn size={16} />
            {t('ui:login.loginButton')}
          </button>
        </form>
      </div>
    </div>
  );
}
