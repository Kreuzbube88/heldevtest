import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useUIStore } from '../stores/uiStore';
import { useTranslation } from 'react-i18next';
import { Settings, LogOut } from 'lucide-react';
import { ThemeSwitcher } from './ThemeSwitcher';

export function Header() {
  const { logout } = useAuthStore();
  const { openConfirm } = useUIStore();
  const { t } = useTranslation('ui');

  const handleLogout = () => {
    openConfirm(
      t('settings.logoutConfirm'),
      '',
      () => {
        logout();
        window.location.href = '/';
      }
    );
  };

  return (
    <header style={{
      background: 'var(--color-bg-secondary)',
      borderBottom: '1px solid var(--color-border)',
      padding: 'var(--space-md) var(--space-xl)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: 'var(--shadow-sm)',
      position: 'sticky',
      top: 0,
      zIndex: 'var(--z-sticky)' as React.CSSProperties['zIndex'],
      transition: 'background var(--transition-base), border-color var(--transition-base)',
    }}>
      <Link
        to="/"
        style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', textDecoration: 'none' }}
      >
        <img src="/logo.png" alt="HELDEVTEST" style={{ height: '32px' }} />
        <span style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: 'var(--text-lg)',
          background: 'var(--color-primary)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          HELDEVTEST
        </span>
      </Link>

      <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
        <ThemeSwitcher />

        <Link
          to="/settings"
          style={{
            color: 'var(--color-text-secondary)',
            display: 'flex',
            padding: 'var(--space-sm)',
            borderRadius: 'var(--radius-md)',
            transition: 'all var(--transition-fast)',
          }}
        >
          <Settings size={20} />
        </Link>

        <button
          onClick={handleLogout}
          style={{
            color: 'var(--color-text-secondary)',
            padding: 'var(--space-sm)',
            display: 'flex',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}
