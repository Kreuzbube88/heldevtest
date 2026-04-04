import { useEffect, useRef, useCallback, useState } from 'react';
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

  useEffect(() => {
    if (currentSession && currentSectionId === '') {
      const firstSection = currentSession.markdown_structure.sections[0];
      if (firstSection) setCurrentSectionId(firstSection.id);
    }
  }, [currentSession, currentSectionId]);

  const getStatus = useCallback((testPath: string): string => {
    const local = localResults.get(testPath);
    if (local?.status) return local.status;
    const existing = currentResults.find(r => r.test_path === testPath);
    return existing?.status ?? 'pending';
  }, [localResults, currentResults]);

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

  const sections = currentSession.markdown_structure.sections;
  const sectionIds = sections.map(s => s.id);
  const currentIndex = sectionIds.indexOf(currentSectionId);
  const currentSection = sections.find(s => s.id === currentSectionId) ?? sections[0];
  const overallStats = getOverallStats(sections, getStatus);

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
          onSectionClick={setCurrentSectionId}
        />

        {/* Center: Test Content */}
        <main ref={mainRef} style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-xl)', position: 'relative', zIndex: 1 }}>
          {currentSection && (() => {
            const sectionStats = getSectionStats(currentSection, getStatus);
            return (
              <>
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
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                ) : (
                  currentSection.subsections.map(sub => (
                    <div key={sub.id} style={{ marginBottom: 'var(--space-xl)' }}>
                      {currentSection.subsections.length > 1 && (
                        <h3 style={{ marginBottom: 'var(--space-md)', paddingBottom: 'var(--space-sm)', borderBottom: '1px solid var(--color-border)' }}>
                          {sub.title}
                        </h3>
                      )}
                      {sub.tests.length === 0 ? (
                        <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)' }}>
                          {t('session.noTests')}
                        </p>
                      ) : (
                        sub.tests.map(test => (
                          <TestItem
                            key={test.path}
                            test={test}
                            result={getResult(test.path)}
                            onStatusChange={(status) => handleResultChange(test.path, 'status', status)}
                            onBugsChange={(bugs) => handleResultChange(test.path, 'bugs', bugs)}
                          />
                        ))
                      )}
                    </div>
                  ))
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

          <div>
            <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-md)' }}>
              {t('session.exportTitle')}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              <button className="btn-secondary" onClick={() => { void handleExport('markdown'); }} style={{ justifyContent: 'flex-start', padding: 'var(--space-sm) var(--space-md)' }}>
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
