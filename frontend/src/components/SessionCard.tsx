import { Calendar, Clock, FileText, Trash2, Play, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatRelativeTime, formatTimestamp } from '../utils/dateFormatter.js';
import type { TestSession } from '../types';

interface Props {
  session: TestSession;
  onOpen: () => void;
  onDelete: () => void;
}

export function SessionCard({ session, onOpen, onDelete }: Props) {
  const { t, i18n } = useTranslation();

  const percentage = session.total_tests > 0
    ? Math.round((session.passed_tests / session.total_tests) * 100)
    : 0;

  const getStatusColor = () => {
    if (session.failed_tests > 0) return 'var(--color-error)';
    if (session.passed_tests === session.total_tests && session.total_tests > 0) return 'var(--color-success)';
    if (session.passed_tests > 0) return 'var(--color-warning)';
    return 'var(--color-info)';
  };

  const getStatusIcon = () => {
    if (session.failed_tests > 0) return <XCircle size={24} color="var(--color-error)" />;
    if (session.passed_tests === session.total_tests && session.total_tests > 0) return <CheckCircle size={24} color="var(--color-success)" />;
    if (session.passed_tests > 0) return <AlertCircle size={24} color="var(--color-warning)" />;
    return <Play size={24} color="var(--color-info)" />;
  };

  const getStatusText = () => {
    if (session.failed_tests > 0) return t('ui:dashboard.statusHasFailures');
    if (session.passed_tests === session.total_tests && session.total_tests > 0) return t('ui:dashboard.statusCompleted');
    if (session.passed_tests > 0) return t('ui:dashboard.statusInProgress');
    return t('ui:dashboard.statusNotStarted');
  };

  return (
    <div
      className="card"
      style={{
        borderLeft: `6px solid ${getStatusColor()}`,
        cursor: 'pointer',
        transition: 'all var(--transition-base)',
        position: 'relative',
        overflow: 'hidden'
      }}
      onClick={onOpen}
    >
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '200px',
        height: '200px',
        background: `radial-gradient(circle, ${getStatusColor()}1a 0%, transparent 70%)`,
        pointerEvents: 'none'
      }} />

      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: 'var(--space-md)',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-xs)' }}>
            {getStatusIcon()}
            <h3 style={{ margin: 0 }}>{session.name}</h3>
          </div>
          <div style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--color-text-tertiary)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-sm)'
          }}>
            <FileText size={14} />
            {session.filename}
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="btn-ghost"
          style={{
            padding: 'var(--space-sm)',
            color: 'var(--color-error)',
            position: 'relative',
            zIndex: 2
          }}
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div style={{ marginBottom: 'var(--space-md)' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 'var(--space-xs)',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--font-weight-semibold)'
        }}>
          <span style={{ color: getStatusColor() }}>{getStatusText()}</span>
          <span style={{ color: 'var(--color-text-tertiary)' }}>{percentage}%</span>
        </div>
        <div className="progress" style={{ height: '8px' }}>
          <div
            className="progress-bar"
            style={{
              width: `${percentage}%`,
              background: getStatusColor()
            }}
          />
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 'var(--space-sm)',
        marginBottom: 'var(--space-md)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-success)'
          }}>
            {session.passed_tests}
          </div>
          <div style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--color-text-tertiary)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            {t('ui:dashboard.labelPass')}
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-error)'
          }}>
            {session.failed_tests}
          </div>
          <div style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--color-text-tertiary)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            {t('ui:dashboard.labelFail')}
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-warning)'
          }}>
            {session.skipped_tests}
          </div>
          <div style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--color-text-tertiary)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            {t('ui:dashboard.labelSkip')}
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-text-secondary)'
          }}>
            {session.total_tests}
          </div>
          <div style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--color-text-tertiary)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            {t('ui:dashboard.labelTotal')}
          </div>
        </div>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-lg)',
        paddingTop: 'var(--space-md)',
        borderTop: '1px solid var(--color-border)',
        fontSize: 'var(--text-xs)',
        color: 'var(--color-text-tertiary)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
          <Calendar size={14} />
          {new Date(session.created_at).toLocaleDateString(i18n.language === 'de' ? 'de-DE' : 'en-US')}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
          <Clock size={14} />
          <span title={formatTimestamp(session.updated_at, i18n.language)}>
            {formatRelativeTime(session.updated_at, i18n.language)}
          </span>
        </div>
      </div>
    </div>
  );
}
