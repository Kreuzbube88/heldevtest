import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../stores/authStore';
import { useUIStore } from '../stores/uiStore';
import { api } from '../api/api';
import { LanguageSelector } from '../components/LanguageSelector';

export function SetupPage() {
  const [step, setStep] = useState(1);
  const [language, setLanguage] = useState('de');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { t, i18n } = useTranslation();
  const { setAuth } = useAuthStore();
  const { addToast } = useUIStore();
  const navigate = useNavigate();

  const handleLanguageNext = () => {
    void i18n.changeLanguage(language);
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      addToast('error', t('ui:setup.passwordMismatch'));
      return;
    }

    try {
      const res = await api.setup(username, password, language) as { user: { language: string }; token: string };
      setAuth(res.user as Parameters<typeof setAuth>[0], res.token);
      void i18n.changeLanguage((res.user as { language: string }).language);
      navigate('/');
    } catch {
      addToast('error', t('ui:toast.error'));
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg-secondary)' }}>
      <div className="card" style={{ width: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-lg)' }}>
          <img src="/logo.png" alt="HELDEVTEST" style={{ height: '64px', marginBottom: 'var(--space-md)' }} />
          <h1>{t('ui:setup.title')}</h1>
        </div>

        {step === 1 ? (
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--space-sm)' }}>
              {t('ui:setup.selectLanguage')}
            </label>
            <LanguageSelector value={language} onChange={setLanguage} />
            <button
              className="btn-primary"
              onClick={handleLanguageNext}
              style={{ width: '100%', marginTop: 'var(--space-lg)' }}
            >
              {t('ui:setup.nextStep')}
            </button>
          </div>
        ) : (
          <form onSubmit={(e) => { void handleSubmit(e); }}>
            <div style={{ marginBottom: 'var(--space-md)' }}>
              <label style={{ display: 'block', marginBottom: 'var(--space-sm)' }}>
                {t('ui:setup.username')}
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: 'var(--space-md)' }}>
              <label style={{ display: 'block', marginBottom: 'var(--space-sm)' }}>
                {t('ui:setup.password')}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: 'var(--space-lg)' }}>
              <label style={{ display: 'block', marginBottom: 'var(--space-sm)' }}>
                {t('ui:setup.confirmPassword')}
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
              <button type="button" className="btn-secondary" onClick={() => setStep(1)}>
                {t('ui:setup.previousStep')}
              </button>
              <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                {t('ui:setup.finish')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
