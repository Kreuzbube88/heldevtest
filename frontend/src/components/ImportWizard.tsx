import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, CheckCircle, ChevronRight } from 'lucide-react';
import type { Problem, Resolution } from '../types';

interface Props {
  problems: Problem[];
  onResolve: (resolutions: Record<string, Resolution>) => void;
  onCancel: () => void;
}

export function ImportWizard({ problems, onResolve, onCancel }: Props) {
  const { t } = useTranslation('ui');
  const [resolutions, setResolutions] = useState<Record<string, Resolution>>({});
  const [selectedId, setSelectedId] = useState<string>(problems[0]?.id ?? '');

  const setResolution = (problemId: string, resolution: Resolution) => {
    setResolutions(prev => ({ ...prev, [problemId]: resolution }));
  };

  const applyToSimilar = (problemId: string) => {
    const problem = problems.find(p => p.id === problemId);
    if (!problem) return;
    const resolution = resolutions[problemId];
    if (!resolution) return;
    const updates: Record<string, Resolution> = {};
    for (const p of problems) {
      if (p.type === problem.type) updates[p.id] = resolution;
    }
    setResolutions(prev => ({ ...prev, ...updates }));
  };

  const allResolved = problems.every(p => resolutions[p.id]);

  const handleIgnoreAll = () => {
    const all: Record<string, Resolution> = {};
    for (const p of problems) all[p.id] = 'import_empty';
    onResolve(all);
  };

  const handleApply = () => {
    onResolve(resolutions);
  };

  const selectedProblem = problems.find(p => p.id === selectedId);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div className="card" style={{
        width: '780px', maxHeight: '80vh',
        display: 'flex', flexDirection: 'column',
        padding: 0, overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: 'var(--space-lg) var(--space-xl)',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 'var(--text-xl)' }}>{t('wizard.title')}</h2>
            <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
              {t('wizard.subtitle', { count: problems.length })}
            </p>
          </div>
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>
            {Object.keys(resolutions).length}/{problems.length} {t('wizard.resolved')}
          </span>
        </div>

        {/* Body: two panes */}
        <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
          {/* Left: section tree */}
          <div style={{
            width: '280px', flexShrink: 0,
            borderRight: '1px solid var(--color-border)',
            overflowY: 'auto', padding: 'var(--space-md)'
          }}>
            <p style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-sm)' }}>
              {t('wizard.sections')}
            </p>
            {problems.map(p => {
              const isSelected = p.id === selectedId;
              const isResolved = Boolean(resolutions[p.id]);
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedId(p.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 'var(--space-xs)',
                    padding: 'var(--space-sm)', borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    background: isSelected ? 'var(--color-bg-tertiary)' : 'transparent',
                    borderLeft: isSelected ? '3px solid var(--color-primary-solid)' : '3px solid transparent',
                    marginBottom: 'var(--space-xs)'
                  }}
                >
                  {isResolved
                    ? <CheckCircle size={14} color="var(--color-success)" />
                    : <AlertTriangle size={14} color="var(--color-warning)" />
                  }
                  <span style={{
                    flex: 1, fontSize: 'var(--text-sm)',
                    fontWeight: isSelected ? 'var(--font-weight-semibold)' : 'var(--font-weight-normal)',
                    color: isSelected ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                  }}>
                    {p.location.section}
                  </span>
                  {isSelected && <ChevronRight size={12} color="var(--color-text-tertiary)" />}
                </div>
              );
            })}
          </div>

          {/* Right: resolution options */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-xl)' }}>
            {selectedProblem ? (
              <>
                <h3 style={{ marginTop: 0 }}>{selectedProblem.location.section}</h3>
                <div style={{
                  padding: 'var(--space-sm) var(--space-md)',
                  background: 'var(--color-bg-tertiary)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: 'var(--space-lg)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-warning)'
                }}>
                  <AlertTriangle size={14} style={{ display: 'inline', marginRight: 'var(--space-xs)' }} />
                  {t(`wizard.problem.${selectedProblem.type}`)}
                </div>

                <p style={{ fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--space-md)', fontSize: 'var(--text-sm)' }}>
                  {t('wizard.chooseResolution')}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                  {(['skip', 'import_empty', 'convert_freetext'] as Resolution[]).map(res => {
                    const isSelected = resolutions[selectedProblem.id] === res;
                    const colorMap: Record<Resolution, { border: string; bg: string }> = {
                      skip: { border: 'var(--color-error)', bg: 'rgba(239, 68, 68, 0.05)' },
                      import_empty: { border: 'var(--color-primary-solid)', bg: 'rgba(102, 126, 234, 0.05)' },
                      convert_freetext: { border: 'var(--color-success)', bg: 'rgba(16, 185, 129, 0.05)' }
                    };
                    const { border, bg } = colorMap[res];
                    return (
                      <label
                        key={res}
                        style={{
                          display: 'flex', alignItems: 'flex-start', gap: 'var(--space-md)',
                          padding: 'var(--space-lg)',
                          border: `3px solid ${isSelected ? border : 'var(--color-border)'}`,
                          borderRadius: 'var(--radius-lg)',
                          cursor: 'pointer',
                          background: isSelected ? bg : 'transparent',
                          transition: 'all var(--transition-fast)'
                        }}
                      >
                        <input
                          type="radio"
                          name={`resolution-${selectedProblem.id}`}
                          value={res}
                          checked={isSelected}
                          onChange={() => setResolution(selectedProblem.id, res)}
                          style={{ width: '20px', height: '20px', marginTop: '2px', cursor: 'pointer', accentColor: border }}
                        />
                        <div>
                          <div style={{ fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--text-lg)' }}>
                            {t(`wizard.resolution.${res}`)}
                          </div>
                          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)', marginTop: '4px' }}>
                            {t(`wizard.resolutionDesc.${res}`)}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>

                {problems.filter(p => p.type === selectedProblem.type).length > 1 && resolutions[selectedProblem.id] && (
                  <button
                    onClick={() => applyToSimilar(selectedProblem.id)}
                    className="btn-secondary"
                    style={{ marginTop: 'var(--space-sm)', fontSize: 'var(--text-sm)' }}
                  >
                    {t('wizard.applyToSimilar')}
                  </button>
                )}
              </>
            ) : (
              <p style={{ color: 'var(--color-text-tertiary)' }}>{t('wizard.selectProblem')}</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: 'var(--space-md) var(--space-xl)',
          borderTop: '1px solid var(--color-border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <button className="btn-secondary" onClick={onCancel}>
            {t('common:cancel')}
          </button>
          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
            <button className="btn-secondary" onClick={handleIgnoreAll}>
              {t('wizard.ignoreAll')}
            </button>
            <button
              className="btn-primary"
              onClick={handleApply}
              disabled={!allResolved}
              style={{ opacity: allResolved ? 1 : 0.4 }}
            >
              {t('wizard.applyAndImport')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
