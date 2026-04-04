import { useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSessionStore } from '../stores/sessionStore';
import { useUIStore } from '../stores/uiStore';
import { api } from '../api/api';
import { Header } from '../components/Header';
import { BackgroundLogo } from '../components/BackgroundLogo';
import { Download } from 'lucide-react';
import type { TestSession, TestResult } from '../types';

export function SessionPage() {
  const { id } = useParams<{ id: string }>();
  const { currentSession, currentResults, localResults, setCurrentSession, updateLocalResult } = useSessionStore();
  const { addToast, setSaving, isSaving } = useUIStore();
  const { t } = useTranslation();
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const loadSession = useCallback(async (sessionId: number) => {
    try {
      const data = await api.getSession(sessionId) as { session: TestSession; results: TestResult[] };
      setCurrentSession(data.session, data.results);
    } catch {
      addToast('error', t('ui:toast.error'));
    }
  }, [setCurrentSession, addToast, t]);

  useEffect(() => {
    if (id) void loadSession(Number(id));
  }, [id, loadSession]);

  const handleResultChange = (testPath: string, field: keyof TestResult, value: string | number | null) => {
    updateLocalResult(testPath, { [field]: value } as Partial<TestResult>);

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    setSaving(true);

    saveTimeoutRef.current = setTimeout(() => {
      const resultLocal = localResults.get(testPath) ?? {};
      const existing = currentResults.find(r => r.test_path === testPath);

      void (async () => {
        try {
          await api.saveTestResult(
            Number(id),
            testPath,
            (resultLocal.status ?? existing?.status ?? 'pending') as string,
            (resultLocal.bugs ?? existing?.bugs ?? '') as string,
            (resultLocal.duration_seconds ?? existing?.duration_seconds) as number | null
          );
          setSaving(false);
        } catch {
          setSaving(false);
          addToast('error', t('ui:toast.error'));
        }
      })();
    }, 500);
  };

  const getResultValue = (testPath: string, field: keyof TestResult): string | number | null => {
    const local = localResults.get(testPath);
    if (local && field in local) return local[field] as string | number | null;
    const existing = currentResults.find(r => r.test_path === testPath);
    if (existing) return existing[field] as string | number | null;
    return field === 'status' ? 'pending' : '';
  };

  const handleExport = async (format: 'markdown' | 'html' | 'json') => {
    try {
      if (format === 'markdown') await api.exportMarkdown(Number(id));
      else if (format === 'html') await api.exportHTML(Number(id));
      else await api.exportJSON(Number(id));
      addToast('success', t('ui:toast.exportSuccess'));
    } catch {
      addToast('error', t('ui:toast.error'));
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

  const structure = currentSession.markdown_structure;

  return (
    <div>
      <BackgroundLogo />
      <Header />
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
          <div>
            <h1>{structure.title}</h1>
            <div style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-xs)', fontSize: 'var(--font-size-sm)' }}>
              {isSaving ? t('ui:session.saving') : t('ui:session.saved')}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
            <button className="btn-secondary" onClick={() => { void handleExport('markdown'); }} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
              <Download size={16} />
              MD
            </button>
            <button className="btn-secondary" onClick={() => { void handleExport('html'); }} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
              <Download size={16} />
              HTML
            </button>
            <button className="btn-secondary" onClick={() => { void handleExport('json'); }} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
              <Download size={16} />
              JSON
            </button>
          </div>
        </div>

        {structure.sections.map(section => (
          <div key={section.id} style={{ marginBottom: 'var(--space-xl)' }}>
            <h2 style={{ marginBottom: 'var(--space-md)', paddingBottom: 'var(--space-sm)', borderBottom: '2px solid var(--color-border)' }}>
              {section.title}
            </h2>
            {section.subsections.map(subsection => (
              <div key={subsection.id} style={{ marginLeft: 'var(--space-lg)', marginTop: 'var(--space-md)' }}>
                <h3 style={{ marginBottom: 'var(--space-sm)' }}>{subsection.title}</h3>
                {subsection.tests.map(test => (
                  <div key={test.path} className="card" style={{ marginTop: 'var(--space-md)' }}>
                    <h4 style={{ marginBottom: 'var(--space-md)' }}>{test.title}</h4>

                    <div style={{ marginBottom: 'var(--space-md)' }}>
                      <label style={{ display: 'block', marginBottom: 'var(--space-sm)', fontWeight: 600 }}>
                        {t('ui:session.testStatus')}
                      </label>
                      <div style={{ display: 'flex', gap: 'var(--space-lg)' }}>
                        {(['pass', 'fail', 'skip'] as const).map(status => (
                          <label key={status} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', cursor: 'pointer' }}>
                            <input
                              type="radio"
                              name={`status-${test.path}`}
                              checked={getResultValue(test.path, 'status') === status}
                              onChange={() => handleResultChange(test.path, 'status', status)}
                            />
                            {t(`ui:session.status${status.charAt(0).toUpperCase()}${status.slice(1)}`)}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div style={{ marginBottom: 'var(--space-md)' }}>
                      <label style={{ display: 'block', marginBottom: 'var(--space-sm)', fontWeight: 600 }}>
                        {t('ui:session.bugs')}
                      </label>
                      <textarea
                        value={(getResultValue(test.path, 'bugs') as string) || ''}
                        onChange={(e) => handleResultChange(test.path, 'bugs', e.target.value)}
                        rows={3}
                        style={{ width: '100%' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: 'var(--space-sm)', fontWeight: 600 }}>
                        {t('ui:session.duration')}
                      </label>
                      <input
                        type="number"
                        value={(getResultValue(test.path, 'duration_seconds') as number) || ''}
                        onChange={(e) => handleResultChange(test.path, 'duration_seconds', e.target.value ? Number(e.target.value) : null)}
                        style={{ width: '200px' }}
                        min={0}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
