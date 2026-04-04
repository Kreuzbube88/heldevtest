import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Clock } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24h
const WARNING_BEFORE = 5 * 60 * 1000; // 5min

export function SessionTimeoutWarning() {
  const { t } = useTranslation('ui');
  const { user, logout } = useAuthStore();
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    if (!user) return;

    if (!localStorage.getItem('loginTime')) {
      localStorage.setItem('loginTime', Date.now().toString());
    }

    const checkTimeout = (): void => {
      const loginTime = localStorage.getItem('loginTime');
      if (!loginTime) return;

      const elapsed = Date.now() - parseInt(loginTime, 10);
      const remaining = SESSION_DURATION - elapsed;

      if (remaining <= 0) {
        logout();
        return;
      }

      if (remaining <= WARNING_BEFORE) {
        setShowWarning(true);
        setTimeLeft(Math.floor(remaining / 1000));
      } else {
        setShowWarning(false);
      }
    };

    checkTimeout();
    const interval = setInterval(checkTimeout, 10000);
    return () => clearInterval(interval);
  }, [user, logout]);

  const handleExtend = (): void => {
    localStorage.setItem('loginTime', Date.now().toString());
    setShowWarning(false);
  };

  if (!showWarning) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div style={{
      position: 'fixed',
      top: 'var(--space-lg)',
      right: 'var(--space-lg)',
      zIndex: 'var(--z-modal)' as unknown as number,
      background: 'var(--color-bg-elevated)',
      border: '2px solid var(--color-warning)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-lg)',
      boxShadow: 'var(--shadow-xl)',
      maxWidth: '400px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
        <Clock size={24} color="var(--color-warning)" />
        <h3 style={{ margin: 0 }}>{t('session.timeoutWarning')}</h3>
      </div>
      <p style={{ marginBottom: 'var(--space-md)' }}>
        {t('session.timeoutMessage', { minutes, seconds: String(seconds).padStart(2, '0') })}
      </p>
      <button onClick={handleExtend} className="btn-primary" style={{ width: '100%' }}>
        {t('session.extendSession')}
      </button>
    </div>
  );
}
