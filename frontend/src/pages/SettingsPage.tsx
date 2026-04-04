import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../stores/authStore';
import { useUIStore } from '../stores/uiStore';
import { api } from '../api/api';
import { Header } from '../components/Header';
import { BackgroundLogo } from '../components/BackgroundLogo';
import { LanguageSelector } from '../components/LanguageSelector';

export function SettingsPage() {
  const { user, updateLanguage } = useAuthStore();
  const { addToast } = useUIStore();
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(user?.language ?? 'de');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleSave = async () => {
    try {
      await api.updateLanguage(language);
      updateLanguage(language);
      void i18n.changeLanguage(language);
      addToast('success', t('ui:settings.languageChanged'));
    } catch {
      addToast('error', t('ui:toast.error'));
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      addToast('error', t('validation:passwordTooShort'));
      return;
    }
    if (newPassword !== confirmPassword) {
      addToast('error', t('ui:settings.passwordMismatch'));
      return;
    }

    setIsChangingPassword(true);
    try {
      await api.changePassword(currentPassword, newPassword);
      addToast('success', t('ui:settings.passwordChanged'));
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      addToast('error', err instanceof Error ? err.message : t('ui:settings.passwordChangeFailed'));
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div>
      <BackgroundLogo />
      <Header />
      <div className="container">
        <h1 style={{ marginBottom: 'var(--space-lg)' }}>{t('ui:settings.title')}</h1>

        <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
          <h2 style={{ marginBottom: 'var(--space-md)' }}>{t('ui:settings.language')}</h2>
          <LanguageSelector value={language} onChange={setLanguage} />
          <button className="btn-primary" onClick={() => { void handleSave(); }} style={{ marginTop: 'var(--space-md)', display: 'block' }}>
            {t('common:save')}
          </button>
        </div>

        <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
          <h2 style={{ marginBottom: 'var(--space-md)' }}>{t('ui:settings.account')}</h2>
          <div style={{ color: 'var(--color-text-secondary)' }}>
            {t('ui:login.username')}: <strong>{user?.username}</strong>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
          <h2 style={{ marginBottom: 'var(--space-md)' }}>{t('ui:settings.backup')}</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-md)' }}>
            {t('ui:settings.backupDescription')}
          </p>
          <button
            className="btn-secondary"
            onClick={() => {
              void (async () => {
                try {
                  await api.downloadBackup();
                  addToast('success', t('ui:toast.backupSuccess'));
                } catch {
                  addToast('error', t('ui:toast.backupError'));
                }
              })();
            }}
          >
            {t('ui:settings.backupDownload')}
          </button>
        </div>

        <div className="card">
          <h2 style={{ marginBottom: 'var(--space-md)' }}>{t('ui:settings.changePassword')}</h2>
          <form onSubmit={(e) => { void handlePasswordChange(e); }}>
            <div className="form-group">
              <label>{t('ui:settings.currentPassword')}</label>
              <input
                type="password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                required
                disabled={isChangingPassword}
              />
            </div>
            <div className="form-group">
              <label>{t('ui:settings.newPassword')}</label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
                minLength={8}
                disabled={isChangingPassword}
              />
            </div>
            <div className="form-group">
              <label>{t('ui:settings.confirmNewPassword')}</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                disabled={isChangingPassword}
              />
            </div>
            <button
              type="submit"
              className="btn-primary"
              disabled={isChangingPassword}
              style={{ marginTop: 'var(--space-md)' }}
            >
              {isChangingPassword ? t('common:loading') : t('ui:settings.changePassword')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
