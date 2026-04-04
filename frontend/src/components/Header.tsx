import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useUIStore } from '../stores/uiStore';
import { useTranslation } from 'react-i18next';
import { Settings, LogOut } from 'lucide-react';

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
      background: 'var(--color-primary)',
      color: 'white',
      padding: 'var(--space-md) var(--space-lg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', textDecoration: 'none', color: 'white' }}>
        <img src="/logo.png" alt="HELDEVTEST" style={{ height: '32px' }} />
        <h1 style={{ fontSize: 'var(--font-size-lg)' }}>HELDEVTEST</h1>
      </Link>

      <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
        <Link to="/settings" style={{ color: 'white', display: 'flex' }}>
          <Settings size={24} />
        </Link>
        <button onClick={handleLogout} style={{ color: 'white', padding: 0, display: 'flex' }}>
          <LogOut size={24} />
        </button>
      </div>
    </header>
  );
}
