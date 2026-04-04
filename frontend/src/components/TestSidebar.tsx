import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronRight, CheckCircle, XCircle, AlertCircle, Circle, FileText } from 'lucide-react';
import type { TestSection } from '../types';
import { getSectionStats, getSubsectionStats, type SectionStats } from '../utils/sessionUtils';

interface Props {
  sections: TestSection[];
  getStatus: (testPath: string) => string;
  currentSectionId: string;
  onSectionClick: (id: string) => void;
}

function StatusIcon({ stats, freetext }: { stats: SectionStats; freetext?: boolean }) {
  if (freetext) return <FileText size={14} color="var(--color-text-tertiary)" />;
  if (stats.total === 0 || stats.notStarted === stats.total) {
    return <Circle size={14} color="var(--color-text-tertiary)" />;
  }
  if (stats.failed > 0) return <XCircle size={14} color="var(--color-error)" />;
  if (stats.passed === stats.total) return <CheckCircle size={14} color="var(--color-success)" />;
  return <AlertCircle size={14} color="var(--color-warning)" />;
}

export function TestSidebar({ sections, getStatus, currentSectionId, onSectionClick }: Props) {
  const { t } = useTranslation('ui');
  const [expanded, setExpanded] = useState<Set<string>>(new Set(sections.map(s => s.id)));

  const toggle = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div style={{
      width: '280px',
      flexShrink: 0,
      borderRight: '1px solid var(--color-border)',
      padding: 'var(--space-lg)',
      overflowY: 'auto',
      background: 'var(--color-bg-secondary)',
    }}>
      <h3 style={{
        marginBottom: 'var(--space-md)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--font-weight-semibold)',
        color: 'var(--color-text-secondary)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      }}>
        {t('session.sections')}
      </h3>

      {sections.map(section => {
        const stats = getSectionStats(section, getStatus);
        const isExpanded = expanded.has(section.id);
        const isCurrent = section.id === currentSectionId;

        return (
          <div key={section.id} style={{ marginBottom: 'var(--space-xs)' }}>
            <div
              onClick={() => onSectionClick(section.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-xs)',
                padding: 'var(--space-sm)',
                borderRadius: 'var(--radius-md)',
                background: isCurrent ? 'var(--color-bg-tertiary)' : 'transparent',
                cursor: 'pointer',
                transition: 'background var(--transition-fast)',
                borderLeft: isCurrent ? '3px solid var(--color-primary-solid)' : '3px solid transparent',
              }}
            >
              {section.subsections.length > 0 && (
                <button
                  onClick={(e) => { e.stopPropagation(); toggle(section.id); }}
                  style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', color: 'var(--color-text-tertiary)', flexShrink: 0 }}
                >
                  {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>
              )}

              <StatusIcon stats={stats} freetext={section.type === 'freetext'} />

              <span style={{
                flex: 1,
                fontSize: 'var(--text-sm)',
                fontWeight: isCurrent ? 'var(--font-weight-semibold)' : 'var(--font-weight-normal)',
                color: isCurrent ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {section.title}
              </span>

              {section.type !== 'freetext' && (
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', flexShrink: 0 }}>
                  {stats.passed}/{stats.total}
                </span>
              )}
            </div>

            {isExpanded && section.subsections.map(sub => {
              const subStats = getSubsectionStats(sub, getStatus);
              return (
                <div
                  key={sub.id}
                  onClick={() => onSectionClick(section.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-xs)',
                    padding: 'var(--space-xs) var(--space-sm)',
                    paddingLeft: '28px',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    transition: 'background var(--transition-fast)',
                  }}
                >
                  <StatusIcon stats={subStats} />
                  <span style={{
                    flex: 1,
                    fontSize: 'var(--text-xs)',
                    color: 'var(--color-text-tertiary)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {sub.title}
                  </span>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', flexShrink: 0 }}>
                    {subStats.passed}/{subStats.total}
                  </span>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
