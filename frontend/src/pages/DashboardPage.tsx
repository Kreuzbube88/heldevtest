import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Upload, FolderKanban } from 'lucide-react';
import { Header } from '../components/Header';
import { BackgroundLogo } from '../components/BackgroundLogo';
import { StatsCards } from '../components/StatsCards';
import { SessionCard } from '../components/SessionCard';
import { SessionFilters } from '../components/SessionFilters';
import { useSessionStore } from '../stores/sessionStore';
import { useUIStore } from '../stores/uiStore';
import { api } from '../api/api';
import type { TestSession } from '../types';

export function DashboardPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { sessions, setSessions } = useSessionStore();
  const { addToast, openConfirm } = useUIStore();

  const [filteredSessions, setFilteredSessions] = useState<TestSession[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('updated');

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

  useEffect(() => {
    let filtered = [...sessions];

    if (searchTerm) {
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.filename.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filter !== 'all') {
      filtered = filtered.filter(s => {
        if (filter === 'completed') return s.passed_tests === s.total_tests && s.total_tests > 0;
        if (filter === 'in_progress') return s.passed_tests > 0 && s.passed_tests < s.total_tests;
        if (filter === 'failed') return s.failed_tests > 0;
        if (filter === 'not_started') return s.passed_tests === 0 && s.failed_tests === 0;
        return true;
      });
    }

    filtered.sort((a, b) => {
      if (sort === 'updated') return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      if (sort === 'created') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sort === 'name') return a.name.localeCompare(b.name);
      if (sort === 'progress') {
        const aP = a.total_tests > 0 ? a.passed_tests / a.total_tests : 0;
        const bP = b.total_tests > 0 ? b.passed_tests / b.total_tests : 0;
        return bP - aP;
      }
      return 0;
    });

    setFilteredSessions(filtered);
  }, [sessions, searchTerm, filter, sort]);

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

    e.target.value = '';
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

  const totalTests = sessions.reduce((sum, s) => sum + s.total_tests, 0);
  const passedTests = sessions.reduce((sum, s) => sum + s.passed_tests, 0);
  const failedTests = sessions.reduce((sum, s) => sum + s.failed_tests, 0);
  const activeSessions = sessions.filter(s => s.passed_tests > 0 && s.passed_tests < s.total_tests).length;

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <BackgroundLogo />
      <Header />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'var(--space-2xl)'
        }}>
          <div>
            <h1 style={{ marginBottom: 'var(--space-xs)' }}>{t('ui:dashboard.title')}</h1>
            <p style={{
              color: 'var(--color-text-secondary)',
              margin: 0,
              fontSize: 'var(--text-lg)'
            }}>
              {t('ui:dashboard.subtitle')}
            </p>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
            <button
              onClick={() => navigate('/templates')}
              className="btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}
            >
              <FolderKanban size={20} />
              {t('ui:dashboard.newFromTemplate')}
            </button>

            <label className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', cursor: 'pointer' }}>
              <Upload size={20} />
              {t('ui:dashboard.uploadTest')}
              <input
                type="file"
                accept=".md"
                onChange={(e) => { void handleFileUpload(e); }}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        </div>

        <StatsCards
          totalTests={totalTests}
          passedTests={passedTests}
          failedTests={failedTests}
          activeSessions={activeSessions}
        />

        <SessionFilters
          onSearchChange={setSearchTerm}
          onFilterChange={setFilter}
          onSortChange={setSort}
        />

        {filteredSessions.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: 'var(--space-3xl)', color: 'var(--color-text-secondary)' }}>
            {searchTerm || filter !== 'all'
              ? t('ui:dashboard.noSessionsFiltered')
              : t('ui:dashboard.noSessions')}
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
            gap: 'var(--space-xl)'
          }}>
            {filteredSessions.map(session => (
              <SessionCard
                key={session.id}
                session={session}
                onOpen={() => navigate(`/session/${session.id}`)}
                onDelete={() => handleDelete(session.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
