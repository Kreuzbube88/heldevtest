import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../stores/authStore';
import { useUIStore } from '../stores/uiStore';
import { api } from '../api/api';
import { Header } from '../components/Header';
import { LanguageSelector } from '../components/LanguageSelector';

export function SettingsPage() {
  const { user, updateLanguage } = useAuthStore();
  const { addToast } = useUIStore();
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(user?.language ?? 'de');

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

  return (
    <div>
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

        <div className="card">
          <h2 style={{ marginBottom: 'var(--space-md)' }}>{t('ui:settings.account')}</h2>
          <div style={{ color: 'var(--color-text-secondary)' }}>
            {t('ui:login.username')}: {user?.username}
          </div>
        </div>
      </div>
    </div>
  );
}
