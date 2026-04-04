import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../stores/authStore';
import { useUIStore } from '../stores/uiStore';
import { api } from '../api/api';
import { LanguageSelector } from '../components/LanguageSelector';
import { ThemeSwitcher } from '../components/ThemeSwitcher';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export function SetupPage() {
  const [step, setStep] = useState(1);
  const [language, setLanguage] = useState('de');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { t, i18n } = useTranslation();
  const { setAuth } = useAuthStore();
  const { addToast } = useUIStore();

  const handleLanguageNext = () => {
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
      window.location.href = '/';
    } catch {
      addToast('error', t('ui:toast.error'));
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
      {/* Ambient gradient background */}
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
        style={{ width: '440px', maxWidth: 'calc(100vw - 32px)', position: 'relative', zIndex: 1 }}
      >
        {/* Large logo */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-lg)' }}>
          <img
            src="/logo.png"
            alt="HELDEVTEST"
            style={{ width: '280px', maxWidth: '100%', height: 'auto', display: 'block', margin: '0 auto var(--space-sm)' }}
          />
        </div>

        {/* Step indicators */}
        <div style={{ display: 'flex', gap: 'var(--space-sm)', justifyContent: 'center', marginBottom: 'var(--space-xl)' }}>
          {[1, 2].map(s => (
            <div
              key={s}
              style={{
                width: '36px',
                height: '4px',
                borderRadius: 'var(--radius-full)',
                background: step >= s ? 'var(--color-primary-solid)' : 'var(--color-border)',
                transition: 'background var(--transition-base)',
              }}
            />
          ))}
        </div>

        {step === 1 ? (
          <div className="animate-slideUp">
            <label>{t('ui:setup.selectLanguage')}</label>
            <LanguageSelector
              value={language}
              onChange={(lang) => {
                setLanguage(lang);
                void i18n.changeLanguage(lang);
              }}
            />
            <button
              className="btn-primary"
              onClick={handleLanguageNext}
              style={{ width: '100%', marginTop: 'var(--space-xl)' }}
            >
              {t('ui:setup.nextStep')}
              <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          <form onSubmit={(e) => { void handleSubmit(e); }} className="animate-slideUp">
            <div style={{ marginBottom: 'var(--space-md)' }}>
              <label>{t('ui:setup.username')}</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div style={{ marginBottom: 'var(--space-md)' }}>
              <label>{t('ui:setup.password')}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>

            <div style={{ marginBottom: 'var(--space-xl)' }}>
              <label>{t('ui:setup.confirmPassword')}</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setStep(1)}
                style={{ flexShrink: 0 }}
              >
                <ArrowLeft size={16} />
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
