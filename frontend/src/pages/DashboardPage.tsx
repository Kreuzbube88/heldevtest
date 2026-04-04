import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSessionStore } from '../stores/sessionStore';
import { useUIStore } from '../stores/uiStore';
import { api } from '../api/api';
import { Header } from '../components/Header';
import { BackgroundLogo } from '../components/BackgroundLogo';
import { Upload, FileText, Trash2 } from 'lucide-react';
import type { TestSession } from '../types';

export function DashboardPage() {
  const { sessions, setSessions } = useSessionStore();
  const { addToast, openConfirm } = useUIStore();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const loadSessions = useCallback(async () => {
    try {
      const data = await api.getSessions() as TestSession[];
      setSessions(data);
    } catch {
      addToast('error', t('ui:toast.error'));
    }
  }, [setSessions, addToast, t]);

  useEffect(() => {
    void loadSessions();
  }, [loadSessions]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const session = await api.uploadTest(file) as { id: number };
      addToast('success', t('ui:toast.uploadSuccess'));
      navigate(`/session/${session.id}`);
    } catch {
      addToast('error', t('ui:toast.uploadError'));
    }
  };

  const handleDelete = (id: number) => {
    openConfirm(
      t('ui:dashboard.deleteSession'),
      t('ui:dashboard.deleteConfirm'),
      () => {
        void (async () => {
          try {
            await api.deleteSession(id);
            addToast('success', t('ui:toast.deleteSuccess'));
            void loadSessions();
          } catch {
            addToast('error', t('ui:toast.error'));
          }
        })();
      }
    );
  };

  return (
    <div>
      <BackgroundLogo />
      <Header />
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
          <h1>{t('ui:dashboard.title')}</h1>
          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
            <label className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', cursor: 'pointer', padding: 'var(--space-sm) var(--space-md)', borderRadius: 'var(--border-radius)', background: 'var(--color-primary)', color: 'white', fontWeight: 600 }}>
              <Upload size={20} />
              {t('ui:dashboard.uploadTest')}
              <input type="file" accept=".md" onChange={(e) => { void handleFileUpload(e); }} style={{ display: 'none' }} />
            </label>
            <button className="btn-secondary" onClick={() => navigate('/templates')} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
              <FileText size={20} />
              {t('ui:dashboard.newFromTemplate')}
            </button>
          </div>
        </div>

        {sessions.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: 'var(--space-xl)', color: 'var(--color-text-secondary)' }}>
            {t('ui:dashboard.noSessions')}
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
            {sessions.map(session => {
              const borderColor = session.failed_tests > 0
                ? 'var(--color-error)'
                : session.passed_tests === session.total_tests && session.total_tests > 0
                  ? 'var(--color-success)'
                  : session.passed_tests > 0
                    ? 'var(--color-warning)'
                    : 'var(--color-info)';
              return (
              <div key={session.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: `4px solid ${borderColor}` }}>
                <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => navigate(`/session/${session.id}`)}>
                  <h3>{session.name}</h3>
                  <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-xs)' }}>
                    {t('ui:dashboard.sessionProgress')}: {session.completed_tests}/{session.total_tests} |{' '}
                    ✓ {session.passed_tests} | ✗ {session.failed_tests} | ⊘ {session.skipped_tests}
                  </div>
                </div>
                <button className="btn-danger" onClick={() => handleDelete(session.id)}>
                  <Trash2 size={20} />
                </button>
              </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
