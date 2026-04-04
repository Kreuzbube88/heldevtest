import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Upload, FolderKanban, FileEdit, Archive } from 'lucide-react';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
import { Header } from '../components/Header';
import { BackgroundLogo } from '../components/BackgroundLogo';
import { StatsCards } from '../components/StatsCards';
import { SessionCard } from '../components/SessionCard';
import { SessionFilters } from '../components/SessionFilters';
import { ImportWizard } from '../components/ImportWizard';
import { useSessionStore } from '../stores/sessionStore';
import { useUIStore } from '../stores/uiStore';
import { api } from '../api/api';
import type { TestSession, Problem, Resolution } from '../types';

export function DashboardPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { sessions, setSessions, appendSessions } = useSessionStore();
  const { addToast, openConfirm } = useUIStore();

  const [filteredSessions, setFilteredSessions] = useState<TestSession[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('updated');
  const [showArchived, setShowArchived] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [showWizard, setShowWizard] = useState(false);
  const [wizardProblems, setWizardProblems] = useState<Problem[]>([]);
  const [pendingSessionId, setPendingSessionId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadSessions = useCallback(async (pageNum: number = 1) => {
    try {
      const data = await api.getSessions({ page: pageNum, limit: 20 });
      if (pageNum === 1) {
        setSessions(data.sessions);
      } else {
        appendSessions(data.sessions);
      }
      setHasMore(data.pagination.hasMore);
    } catch {
      addToast('error', t('ui:toast.error'));
    }
  }, [setSessions, appendSessions, addToast, t]);

  useEffect(() => {
    setPage(1);
    void loadSessions(1);
  }, [loadSessions]);

  useEffect(() => {
    let filtered = [...sessions];

    if (!showArchived) {
      filtered = filtered.filter(s => s.archived !== 1);
    }

    if (debouncedSearch) {
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        s.filename.toLowerCase().includes(debouncedSearch.toLowerCase())
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
  }, [sessions, debouncedSearch, filter, sort, showArchived]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    if (!file.name.endsWith('.md')) {
      addToast('error', t('ui:errors.uploadFailed'));
      return;
    }
    await processUpload(file);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processUpload(file);
    e.target.value = '';
  };

  const processUpload = async (file: File) => {
    try {
      const response = await api.uploadTest(file);
      if (response.problems && response.problems.length > 0 && response.sessionId) {
        setWizardProblems(response.problems);
        setPendingSessionId(response.sessionId);
        setShowWizard(true);
      } else if (response.sessionId) {
        addToast('success', t('ui:toast.uploadSuccess'));
        navigate(`/session/${response.sessionId}`);
      }
    } catch {
      addToast('error', t('ui:errors.uploadFailed'));
    }
  };

  const handleWizardResolve = async (resolutions: Record<string, Resolution>) => {
    if (!pendingSessionId) return;
    // Convert problem-id keyed resolutions to sectionIndex keyed
    const sectionResolutions: Record<string, Resolution> = {};
    for (const problem of wizardProblems) {
      const res = resolutions[problem.id];
      if (res) sectionResolutions[String(problem.location.sectionIndex)] = res;
    }
    try {
      await api.applyImportResolutions(pendingSessionId, sectionResolutions);
      setShowWizard(false);
      addToast('success', t('ui:toast.importSuccess'));
      navigate(`/session/${pendingSessionId}`);
    } catch {
      addToast('error', t('ui:toast.error'));
    }
  };

  const handleWizardCancel = async () => {
    if (pendingSessionId) {
      try { await api.deleteSession(pendingSessionId); } catch { /* ignore */ }
    }
    setShowWizard(false);
    setPendingSessionId(null);
    setWizardProblems([]);
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
            setPage(1); void loadSessions(1);
          } catch {
            addToast('error', t('ui:toast.error'));
          }
        })();
      }
    );
  };

  const handleClone = async (id: number) => {
    try {
      await api.cloneSession(id);
      addToast('success', t('ui:toast.cloneSuccess'));
      setPage(1); void loadSessions(1);
    } catch {
      addToast('error', t('ui:toast.error'));
    }
  };

  const handleArchive = async (id: number, currentlyArchived: boolean) => {
    try {
      if (currentlyArchived) {
        await api.unarchiveSession(id);
        addToast('success', t('ui:toast.unarchiveSuccess'));
      } else {
        await api.archiveSession(id);
        addToast('success', t('ui:toast.archiveSuccess'));
      }
      setPage(1); void loadSessions(1);
    } catch {
      addToast('error', t('ui:toast.error'));
    }
  };

  const totalTests = sessions.reduce((sum, s) => sum + s.total_tests, 0);
  const passedTests = sessions.reduce((sum, s) => sum + s.passed_tests, 0);
  const failedTests = sessions.reduce((sum, s) => sum + s.failed_tests, 0);
  const activeSessions = sessions.filter(s => s.passed_tests > 0 && s.passed_tests < s.total_tests).length;

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        outline: isDragging ? '3px dashed var(--color-primary-solid)' : 'none',
        outlineOffset: '-4px',
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={(e) => { void handleDrop(e); }}
    >
      {showWizard && (
        <ImportWizard
          problems={wizardProblems}
          onResolve={(res) => { void handleWizardResolve(res); }}
          onCancel={() => { void handleWizardCancel(); }}
        />
      )}
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
              onClick={() => navigate('/builder')}
              className="btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}
            >
              <FileEdit size={20} />
              {t('ui:builder.create')}
            </button>

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
                ref={fileInputRef}
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

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          <div style={{ flex: 1 }}>
            <SessionFilters
              onSearchChange={setSearchTerm}
              onFilterChange={setFilter}
              onSortChange={setSort}
            />
          </div>
          <button
            onClick={() => setShowArchived(prev => !prev)}
            className={showArchived ? 'btn-primary' : 'btn-secondary'}
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', flexShrink: 0 }}
          >
            <Archive size={16} />
            {t('ui:dashboard.showArchived')}
          </button>
        </div>

        {filteredSessions.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: 'var(--space-3xl)', color: 'var(--color-text-secondary)' }}>
            {searchTerm || filter !== 'all'
              ? t('ui:dashboard.noSessionsFiltered')
              : t('ui:dashboard.noSessions')}
          </div>
        ) : (
          <>
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
                  onClone={() => { void handleClone(session.id); }}
                  onArchive={() => { void handleArchive(session.id, session.archived === 1); }}
                />
              ))}
            </div>
            {hasMore && !debouncedSearch && filter === 'all' && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'var(--space-xl)' }}>
                <button
                  className="btn-secondary"
                  onClick={() => {
                    const nextPage = page + 1;
                    setPage(nextPage);
                    void loadSessions(nextPage);
                  }}
                >
                  {t('ui:dashboard.loadMore')}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
