import { useTranslation } from 'react-i18next';
import { Check, X, Minus, CheckCircle, XCircle, AlertCircle, Circle, Clock } from 'lucide-react';
import type { Test } from '../types';
import { formatTimestamp, formatRelativeTime } from '../utils/dateFormatter.js';

interface TestResult {
  status: string;
  bugs: string;
  updated_at?: string;
}

interface Props {
  test: Test;
  result: TestResult;
  onStatusChange: (status: 'pass' | 'fail' | 'skip') => void;
  onBugsChange: (bugs: string) => void;
}

export function TestItem({ test, result, onStatusChange, onBugsChange }: Props) {
  const { t, i18n } = useTranslation('ui');
  const { status, bugs, updated_at } = result;

  const getBorderColor = () => {
    if (status === 'pass') return 'var(--color-success)';
    if (status === 'fail') return 'var(--color-error)';
    if (status === 'skip') return 'var(--color-warning)';
    return 'var(--color-border)';
  };

  const statusIcon = () => {
    if (status === 'pass') return <CheckCircle size={22} color="var(--color-success)" />;
    if (status === 'fail') return <XCircle size={22} color="var(--color-error)" />;
    if (status === 'skip') return <AlertCircle size={22} color="var(--color-warning)" />;
    return <Circle size={22} color="var(--color-text-tertiary)" />;
  };

  const passStyle: React.CSSProperties = status === 'pass'
    ? { background: 'var(--color-success)', color: 'white', border: 'none' }
    : {};
  const failStyle: React.CSSProperties = status === 'fail'
    ? { background: 'var(--color-error)', color: 'white', border: 'none' }
    : {};
  const skipStyle: React.CSSProperties = status === 'skip'
    ? { background: 'var(--color-warning)', color: 'white', border: 'none' }
    : {};

  return (
    <div
      className="card"
      style={{
        borderLeft: `3px solid ${getBorderColor()}`,
        marginBottom: 'var(--space-md)',
        transition: 'border-color var(--transition-base)',
        padding: 'var(--space-lg)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
        <div style={{ flexShrink: 0, marginTop: '2px' }}>{statusIcon()}</div>
        <div style={{ flex: 1 }}>
          <h4 style={{ margin: 0 }}>{test.title}</h4>
        </div>
        {(status === 'pass' || status === 'fail' || status === 'skip') && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <span className={
              status === 'pass' ? 'badge badge-success' :
              status === 'fail' ? 'badge badge-error' :
              'badge badge-warning'
            }>
              {status === 'pass' ? t('session.statusPass') :
               status === 'fail' ? t('session.statusFail') :
               t('session.statusSkip')}
            </span>
            {updated_at && (
              <span
                title={formatTimestamp(updated_at, i18n.language)}
                style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}
              >
                <Clock size={13} />
                {formatRelativeTime(updated_at, i18n.language)}
              </span>
            )}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
        <button
          onClick={() => onStatusChange('pass')}
          className="btn-secondary"
          style={{ flex: 1, ...passStyle }}
        >
          <Check size={16} />
          {t('session.statusPass')}
        </button>
        <button
          onClick={() => onStatusChange('fail')}
          className="btn-secondary"
          style={{ flex: 1, ...failStyle }}
        >
          <X size={16} />
          {t('session.statusFail')}
        </button>
        <button
          onClick={() => onStatusChange('skip')}
          className="btn-secondary"
          style={{ flex: 1, ...skipStyle }}
        >
          <Minus size={16} />
          {t('session.statusSkip')}
        </button>
      </div>

      {status === 'fail' && (
        <div style={{ marginTop: 'var(--space-md)' }}>
          <label>{t('session.bugs')}</label>
          <textarea
            value={bugs}
            onChange={(e) => onBugsChange(e.target.value)}
            placeholder={t('session.bugsPlaceholder')}
            rows={3}
            style={{ resize: 'vertical' }}
          />
        </div>
      )}
    </div>
  );
}
