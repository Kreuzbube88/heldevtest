import React, { useEffect, useRef, useCallback, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSessionStore } from '../stores/sessionStore';
import { useUIStore } from '../stores/uiStore';
import { api } from '../api/api';
import { Header } from '../components/Header';
import { BackgroundLogo } from '../components/BackgroundLogo';
import { TestSidebar } from '../components/TestSidebar';
import { TestItem } from '../components/TestItem';
import { ArrowLeft, ArrowRight, Download } from 'lucide-react';
import { getSectionStats, getOverallStats } from '../utils/sessionUtils';
import type { TestSession, TestResult } from '../types';
import { FixedSizeList } from 'react-window';
import type { ListChildComponentProps } from 'react-window';
import type { Test, TestSubsection } from '../types';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import type { KeyboardShortcut } from '../hooks/useKeyboardShortcuts';
import { useDebounce } from '../hooks/useDebounce';

interface FilterState {
  search: string;
  status: 'all' | 'pass' | 'fail' | 'skip' | 'pending';
}

interface SavedPosition {
  sectionId: string;
  timestamp: number;
}

function filterTests(tests: Test[], filter: FilterState, debouncedSearch: string, getStatus: (path: string) => string): Test[] {
  let result = tests;
  if (debouncedSearch) {
    const lower = debouncedSearch.toLowerCase();
    result = result.filter(t => t.title.toLowerCase().includes(lower));
  }
  if (filter.status !== 'all') {
    result = result.filter(t => getStatus(t.path) === filter.status);
  }
  return result;
}

export function SessionPage() {
  const { id } = useParams<{ id: string }>();
  const { currentSession, currentResults, localResults, setCurrentSession, updateLocalResult, updateSectionContent } = useSessionStore();
  const { addToast, setSaving, isSaving } = useUIStore();
  const { t } = useTranslation('ui');
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const freetextTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const localResultsRef = useRef(localResults);
  useEffect(() => { localResultsRef.current = localResults; }, [localResults]);
  const mainRef = useRef<HTMLElement>(null);

  const [currentSectionId, setCurrentSectionId] = useState('');
  const [continueSectionId, setContinueSectionId] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterState>({ search: '', status: 'all' });
  const debouncedSearch = useDebounce(filter.search, 300);
  const [bulkMode, setBulkMode] = useState<boolean>(false);
  const [selectedTests, setSelectedTests] = useState<Set<string>>(new Set());
  const [currentTestPath, setCurrentTestPath] = useState<string>('');
  const [showTimers, setShowTimers] = useState<boolean>(() => localStorage.getItem('show-test-timers') === '1');

  const loadSession = useCallback(async (sessionId: number) => {
    try {
      const data = await api.getSession(sessionId) as { session: TestSession; results: TestResult[] };
      setCurrentSession(data.session, data.results);
    } catch {
      addToast('error', t('toast.error'));
    }
  }, [setCurrentSession, addToast, t]);

  useEffect(() => {
    if (id) void loadSession(Number(id));
  }, [id, loadSession]);

  // Init section + restore saved position
  useEffect(() => {
    if (currentSession && currentSectionId === '') {
      const firstSection = currentSession.markdown_structure.sections[0];
      if (firstSection) {
        setCurrentSectionId(firstSection.id);

        if (id) {
          const saved = localStorage.getItem(`session-${id}-position`);
          if (saved) {
            try {
              const { sectionId, timestamp } = JSON.parse(saved) as SavedPosition;
              if (Date.now() - timestamp < 24 * 60 * 60 * 1000 && sectionId !== firstSection.id) {
                const exists = currentSession.markdown_structure.sections.some(s => s.id === sectionId);
                if (exists) setContinueSectionId(sectionId);
              }
            } catch { /* ignore */ }
          }
        }
      }
    }
  }, [currentSession, currentSectionId, id]);

  // Persist current section position
  useEffect(() => {
    if (!id || !currentSectionId) return;
    localStorage.setItem(`session-${id}-position`, JSON.stringify({
      sectionId: currentSectionId,
      timestamp: Date.now(),
    } satisfies SavedPosition));
  }, [id, currentSectionId]);

  // Persist showTimers setting
  useEffect(() => {
    localStorage.setItem('show-test-timers', showTimers ? '1' : '0');
  }, [showTimers]);

  const getStatus = useCallback((testPath: string): string => {
    const local = localResults.get(testPath);
    if (local?.status) return local.status;
    const existing = currentResults.find(r => r.test_path === testPath);
    return existing?.status ?? 'pending';
  }, [localResults, currentResults]);

  const sections = currentSession?.markdown_structure.sections ?? [];
  const overallStats = useMemo(
    () => getOverallStats(sections, getStatus),
    [sections, getStatus]
  );

  const getResult = (testPath: string): { status: string; bugs: string; updated_at?: string } => {
    const local = localResults.get(testPath);
    const existing = currentResults.find(r => r.test_path === testPath);
    return {
      status: local?.status ?? existing?.status ?? 'pending',
      bugs: (local?.bugs ?? existing?.bugs ?? '') as string,
      updated_at: existing?.updated_at,
    };
  };

  const handleResultChange = (testPath: string, field: keyof TestResult, value: string | number | null) => {
    updateLocalResult(testPath, { [field]: value } as Partial<TestResult>);
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    setSaving(true);

    saveTimeoutRef.current = setTimeout(() => {
      const resultLocal = localResultsRef.current.get(testPath) ?? {};
      const existing = currentResults.find(r => r.test_path === testPath);
      void (async () => {
        try {
          await api.saveTestResult(
            Number(id),
            testPath,
            (resultLocal.status ?? existing?.status ?? 'pending') as string,
            (resultLocal.bugs ?? existing?.bugs ?? '') as string
          );
          setSaving(false);
        } catch {
          setSaving(false);
          addToast('error', t('toast.error'));
        }
      })();
    }, 500);
  };

  const manualSave = useCallback(async (): Promise<void> => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    setSaving(true);
    const entries = Array.from(localResultsRef.current.entries());
    try {
      await Promise.all(entries.map(([testPath, result]) => {
        const existing = currentResults.find(r => r.test_path === testPath);
        return api.saveTestResult(
          Number(id),
          testPath,
          (result.status ?? existing?.status ?? 'pending') as string,
          (result.bugs ?? existing?.bugs ?? '') as string
        );
      }));
      setSaving(false);
      addToast('success', t('toast.saveSuccess'));
    } catch {
      setSaving(false);
      addToast('error', t('toast.error'));
    }
  }, [currentResults, id, setSaving, addToast, t]);

  const handleExport = async (format: 'markdown' | 'html' | 'json') => {
    try {
      if (format === 'markdown') await api.exportMarkdown(Number(id));
      else if (format === 'html') await api.exportHTML(Number(id));
      else await api.exportJSON(Number(id));
      addToast('success', t('toast.exportSuccess'));
    } catch {
      addToast('error', t('toast.error'));
    }
  };

  if (!currentSession) {
    return (
      <div>
        <BackgroundLogo />
        <Header />
        <div className="container">{t('common:loading')}</div>
      </div>
    );
  }

  const sectionIds = sections.map(s => s.id);
  const currentIndex = sectionIds.indexOf(currentSectionId);
  const currentSection = sections.find(s => s.id === currentSectionId) ?? sections[0];

  const allCurrentTests: Test[] = currentSection
    ? currentSection.subsections.flatMap(sub => sub.tests)
    : [];

  const allFilteredTests: Test[] = currentSection
    ? currentSection.subsections.flatMap(sub => filterTests(sub.tests, filter, debouncedSearch, getStatus))
    : [];

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentSectionId(sectionIds[currentIndex - 1]);
      mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    if (currentIndex < sectionIds.length - 1) {
      setCurrentSectionId(sectionIds[currentIndex + 1]);
      mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFreetextChange = (sectionId: string, content: string) => {
    updateSectionContent(sectionId, content);
    setSaving(true);
    if (freetextTimeoutRef.current) clearTimeout(freetextTimeoutRef.current);
    freetextTimeoutRef.current = setTimeout(() => {
      void (async () => {
        try {
          await api.updateSectionContent(Number(id), sectionId, content);
          setSaving(false);
        } catch {
          setSaving(false);
          addToast('error', t('toast.error'));
        }
      })();
    }, 500);
  };

  // Keyboard shortcut helpers
  const goToNextUnfinishedTest = (): void => {
    const startIdx = currentTestPath
      ? allCurrentTests.findIndex(t => t.path === currentTestPath) + 1
      : 0;
    const slice = allCurrentTests.slice(startIdx);
    const next = slice.find(t => getStatus(t.path) === 'pending')
      ?? allCurrentTests.find(t => getStatus(t.path) === 'pending');
    if (next) {
      setCurrentTestPath(next.path);
      document.querySelector<HTMLElement>(`[data-test-path="${next.path}"]`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const goToPreviousTest = (): void => {
    const idx = allCurrentTests.findIndex(t => t.path === currentTestPath);
    if (idx > 0) {
      const prev = allCurrentTests[idx - 1];
      setCurrentTestPath(prev.path);
      document.querySelector<HTMLElement>(`[data-test-path="${prev.path}"]`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const markCurrentTest = (status: 'pass' | 'fail' | 'skip'): void => {
    if (currentTestPath) {
      handleResultChange(currentTestPath, 'status', status);
    }
  };

  const focusSearch = (): void => {
    document.querySelector<HTMLInputElement>('input[type="search"]')?.focus();
  };

  const closeModals = (): void => {
    if (bulkMode) {
      setBulkMode(false);
      setSelectedTests(new Set());
    }
    setContinueSectionId(null);
  };

  const openExportMenu = (): void => {
    document.querySelector<HTMLButtonElement>('[data-export-btn]')?.focus();
  };

  const bulkMarkAs = (status: 'pass' | 'fail' | 'skip'): void => {
    const count = selectedTests.size;
    selectedTests.forEach(testPath => handleResultChange(testPath, 'status', status));
    setSelectedTests(new Set());
    addToast('success', t('toast.bulkUpdateSuccess', { count }));
  };

  const shortcuts: KeyboardShortcut[] = [
    { key: 'n', callback: goToNextUnfinishedTest, description: t('shortcuts.nextTest') },
    { key: 'p', callback: goToPreviousTest, description: t('shortcuts.prevTest') },
    { key: '1', callback: () => markCurrentTest('pass'), description: t('shortcuts.markPass') },
    { key: '2', callback: () => markCurrentTest('fail'), description: t('shortcuts.markFail') },
    { key: '3', callback: () => markCurrentTest('skip'), description: t('shortcuts.markSkip') },
    { key: 's', callback: () => { void manualSave(); }, description: t('shortcuts.save') },
    { key: '/', callback: focusSearch, description: t('shortcuts.focusSearch') },
    { key: 'Escape', callback: closeModals, description: t('shortcuts.closeDialog') },
    { key: 'e', ctrl: true, callback: openExportMenu, description: t('shortcuts.exportMenu') },
    { key: 'a', ctrl: true, callback: () => setSelectedTests(new Set(allFilteredTests.map(t => t.path))), description: t('shortcuts.selectAll') },
    { key: 'd', ctrl: true, callback: () => setSelectedTests(new Set()), description: t('shortcuts.deselectAll') },
  ];

  useKeyboardShortcuts(shortcuts, true);

  const makeTestRowRenderer = (tests: Test[]) =>
    ({ index, style }: ListChildComponentProps) => {
      const test = tests[index];
      if (!test) return null;
      return (
        <div style={style} data-test-path={test.path}>
          <TestItem
            test={test}
            result={getResult(test.path)}
            onStatusChange={(status) => handleResultChange(test.path, 'status', status)}
            onBugsChange={(bugs) => handleResultChange(test.path, 'bugs', bugs)}
            bulkMode={bulkMode}
            isSelected={selectedTests.has(test.path)}
            onSelectionChange={(selected) => {
              setSelectedTests(prev => {
                const next = new Set(prev);
                if (selected) next.add(test.path); else next.delete(test.path);
                return next;
              });
            }}
            isCurrent={currentTestPath === test.path}
            showTimer={showTimers}
          />
        </div>
      );
    };

  const renderTestList = (sub: TestSubsection, filtered: Test[]): React.ReactNode => {
    if (filtered.length === 0) {
      return (
        <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)' }}>
          {filter.search || filter.status !== 'all' ? t('session.noTestsFiltered') : t('session.noTests')}
        </p>
      );
    }
    if (filtered.length > 50) {
      return (
        <FixedSizeList height={600} itemCount={filtered.length} itemSize={120} width="100%">
          {makeTestRowRenderer(filtered)}
        </FixedSizeList>
      );
    }
    return filtered.map(test => (
      <div key={test.path} data-test-path={test.path}>
        <TestItem
          test={test}
          result={getResult(test.path)}
          onStatusChange={(status) => {
            setCurrentTestPath(test.path);
            handleResultChange(test.path, 'status', status);
          }}
          onBugsChange={(bugs) => handleResultChange(test.path, 'bugs', bugs)}
          bulkMode={bulkMode}
          isSelected={selectedTests.has(test.path)}
          onSelectionChange={(selected) => {
            setSelectedTests(prev => {
              const next = new Set(prev);
              if (selected) next.add(test.path); else next.delete(test.path);
              return next;
            });
          }}
          isCurrent={currentTestPath === test.path}
          showTimer={showTimers}
        />
      </div>
    ));
    // sub param kept for subsection title rendering at call site
    void sub;
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <BackgroundLogo />
      <Header />

      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {/* Left: Section Sidebar */}
        <TestSidebar
          sections={sections}
          getStatus={getStatus}
          currentSectionId={currentSectionId}
          onSectionClick={(sid) => { setCurrentSectionId(sid); setContinueSectionId(null); }}
        />

        {/* Center: Test Content */}
        <main ref={mainRef} style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-xl)', position: 'relative', zIndex: 1 }}>
          {currentSection && (() => {
            const sectionStats = getSectionStats(currentSection, getStatus);
            return (
              <>
                {/* Continue where you left off banner */}
                {continueSectionId && (
                  <div className="card" style={{
                    background: 'var(--color-info)',
                    padding: 'var(--space-md)',
                    marginBottom: 'var(--space-lg)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-md)',
                  }}>
                    <span style={{ flex: 1, margin: 0, color: 'white' }}>
                      {t('session.continueFromLast', {
                        name: sections.find(s => s.id === continueSectionId)?.title ?? '',
                      })}
                    </span>
                    <button
                      onClick={() => { setCurrentSectionId(continueSectionId); setContinueSectionId(null); }}
                      className="btn-primary"
                    >
                      {t('session.continueBtn')}
                    </button>
                    <button
                      onClick={() => setContinueSectionId(null)}
                      className="btn-ghost"
                      style={{ color: 'white' }}
                    >
                      ✕
                    </button>
                  </div>
                )}

                {/* Section header */}
                <div style={{ marginBottom: 'var(--space-xl)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-sm)' }}>
                    <h2 style={{ margin: 0 }}>{currentSection.title}</h2>
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', paddingTop: 'var(--space-sm)' }}>
                      {isSaving ? t('session.saving') : t('session.saved')}
                    </span>
                  </div>

                  {currentSection.type !== 'freetext' && (
                    <>
                      <div className="progress" style={{ marginTop: 'var(--space-md)' }}>
                        <div className="progress-bar" style={{ width: `${sectionStats.percentage}%` }} />
                      </div>
                      <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-sm)', flexWrap: 'wrap' }}>
                        <span className="badge badge-success">{sectionStats.passed} {t('session.statusPass')}</span>
                        <span className="badge badge-error">{sectionStats.failed} {t('session.statusFail')}</span>
                        <span className="badge badge-warning">{sectionStats.skipped} {t('session.statusSkip')}</span>
                        <span className="badge badge-info">{sectionStats.notStarted} {t('session.notStarted')}</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Tests or Freetext */}
                {currentSection.type === 'freetext' ? (
                  <div className="card" style={{ padding: 'var(--space-xl)' }}>
                    <textarea
                      value={currentSection.content ?? ''}
                      onChange={(e) => handleFreetextChange(currentSection.id, e.target.value)}
                      placeholder={t('session.freetextPlaceholder')}
                      style={{
                        width: '100%',
                        minHeight: '300px',
                        padding: 'var(--space-md)',
                        fontSize: 'var(--text-base)',
                        fontFamily: 'inherit',
                        border: '2px solid var(--color-border)',
                        borderRadius: 'var(--radius-md)',
                        resize: 'vertical',
                        background: 'var(--color-bg-primary)',
                        color: 'var(--color-text-primary)',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                ) : (
                  <>
                    {/* Filter bar */}
                    <div style={{ display: 'flex', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
                      <input
                        type="search"
                        placeholder={t('session.searchTests')}
                        value={filter.search}
                        onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
                        style={{ flex: 1 }}
                      />
                      <select
                        value={filter.status}
                        onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value as FilterState['status'] }))}
                      >
                        <option value="all">{t('session.filterAll')}</option>
                        <option value="pass">{t('session.filterPassed')}</option>
                        <option value="fail">{t('session.filterFailed')}</option>
                        <option value="skip">{t('session.filterSkipped')}</option>
                        <option value="pending">{t('session.filterNotStarted')}</option>
                      </select>
                    </div>

                    {/* Bulk mode bar */}
                    <div style={{ marginBottom: 'var(--space-md)', display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap', alignItems: 'center' }}>
                      <button
                        onClick={() => { setBulkMode(m => !m); setSelectedTests(new Set()); }}
                        className="btn-secondary"
                        style={{ fontSize: 'var(--text-sm)' }}
                      >
                        {bulkMode ? t('session.exitBulkMode') : t('session.bulkMode')}
                      </button>
                      {bulkMode && selectedTests.size > 0 && (
                        <>
                          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                            {t('session.selectedCount', { count: selectedTests.size })}
                          </span>
                          <button onClick={() => bulkMarkAs('pass')} className="btn-secondary" style={{ fontSize: 'var(--text-sm)' }}>
                            {t('session.bulkMarkPass')}
                          </button>
                          <button onClick={() => bulkMarkAs('fail')} className="btn-secondary" style={{ fontSize: 'var(--text-sm)' }}>
                            {t('session.bulkMarkFail')}
                          </button>
                          <button onClick={() => bulkMarkAs('skip')} className="btn-secondary" style={{ fontSize: 'var(--text-sm)' }}>
                            {t('session.bulkMarkSkip')}
                          </button>
                          <button onClick={() => setSelectedTests(new Set())} className="btn-ghost" style={{ fontSize: 'var(--text-sm)' }}>
                            {t('session.clearSelection')}
                          </button>
                        </>
                      )}
                    </div>

                    {currentSection.subsections.map(sub => {
                      const filtered = filterTests(sub.tests, filter, debouncedSearch, getStatus);
                      return (
                        <div key={sub.id} style={{ marginBottom: 'var(--space-xl)' }}>
                          {currentSection.subsections.length > 1 && (
                            <h3 style={{ marginBottom: 'var(--space-md)', paddingBottom: 'var(--space-sm)', borderBottom: '1px solid var(--color-border)' }}>
                              {sub.title}
                            </h3>
                          )}
                          {renderTestList(sub, filtered)}
                        </div>
                      );
                    })}
                  </>
                )}

                {/* Prev / Next navigation */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-xl)', paddingTop: 'var(--space-lg)', borderTop: '1px solid var(--color-border)' }}>
                  <button
                    onClick={handlePrevious}
                    className="btn-secondary"
                    disabled={currentIndex <= 0}
                    style={{ opacity: currentIndex <= 0 ? 0.4 : 1 }}
                  >
                    <ArrowLeft size={18} />
                    {t('session.previous')}
                  </button>
                  <button
                    onClick={handleNext}
                    className="btn-primary"
                    disabled={currentIndex >= sectionIds.length - 1}
                    style={{ opacity: currentIndex >= sectionIds.length - 1 ? 0.4 : 1 }}
                  >
                    {t('session.next')}
                    <ArrowRight size={18} />
                  </button>
                </div>
              </>
            );
          })()}
        </main>

        {/* Right: Stats + Export */}
        <aside style={{
          width: '220px',
          flexShrink: 0,
          borderLeft: '1px solid var(--color-border)',
          padding: 'var(--space-lg)',
          overflowY: 'auto',
          background: 'var(--color-bg-secondary)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-lg)',
        }}>
          <div>
            <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-md)' }}>
              {t('session.sessionStats')}
            </h3>
            <div className="progress" style={{ marginBottom: 'var(--space-sm)' }}>
              <div className="progress-bar" style={{ width: `${overallStats.percentage}%` }} />
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-md)', textAlign: 'center' }}>
              {overallStats.percentage}% — {overallStats.total - overallStats.notStarted}/{overallStats.total}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)' }}>
                <span className="badge badge-success" style={{ fontSize: 'var(--text-xs)' }}>{t('session.statusPass')}</span>
                <span style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-success)' }}>{overallStats.passed}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)' }}>
                <span className="badge badge-error" style={{ fontSize: 'var(--text-xs)' }}>{t('session.statusFail')}</span>
                <span style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-error)' }}>{overallStats.failed}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)' }}>
                <span className="badge badge-warning" style={{ fontSize: 'var(--text-xs)' }}>{t('session.statusSkip')}</span>
                <span style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-warning)' }}>{overallStats.skipped}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)' }}>
                <span className="badge badge-info" style={{ fontSize: 'var(--text-xs)' }}>{t('session.notStarted')}</span>
                <span style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-info)' }}>{overallStats.notStarted}</span>
              </div>
            </div>
          </div>

          {/* Timer toggle */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', fontSize: 'var(--text-sm)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={showTimers}
                onChange={(e) => setShowTimers(e.target.checked)}
              />
              {t('session.showTimers')}
            </label>
          </div>

          <div>
            <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-md)' }}>
              {t('session.exportTitle')}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              <button data-export-btn className="btn-secondary" onClick={() => { void handleExport('markdown'); }} style={{ justifyContent: 'flex-start', padding: 'var(--space-sm) var(--space-md)' }}>
                <Download size={14} />
                MD
              </button>
              <button className="btn-secondary" onClick={() => { void handleExport('html'); }} style={{ justifyContent: 'flex-start', padding: 'var(--space-sm) var(--space-md)' }}>
                <Download size={14} />
                HTML
              </button>
              <button className="btn-secondary" onClick={() => { void handleExport('json'); }} style={{ justifyContent: 'flex-start', padding: 'var(--space-sm) var(--space-md)' }}>
                <Download size={14} />
                JSON
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
