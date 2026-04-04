import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, X, Minus, CheckCircle, XCircle, AlertCircle, Circle, Clock, Copy } from 'lucide-react';
import type { Test, BugTemplate } from '../types';
import { formatTimestamp, formatRelativeTime } from '../utils/dateFormatter.js';
import { TestTimer } from './TestTimer';
import { QuickActionsMenu } from './QuickActionsMenu';
import type { QuickAction } from './QuickActionsMenu';

interface TestResult {
  status: string;
  bugs: string;
  updated_at?: string;
}

const DEFAULT_BUG_TEMPLATES: BugTemplate[] = [
  {
    id: 'default',
    name: 'Default',
    template: '**Steps:**\n1. \n\n**Expected:**\n\n**Actual:**\n\n**Environment:**\n',
  },
  {
    id: 'crash',
    name: 'Crash/Error',
    template: '**Error:**\n\n**Stack Trace:**\n\n**To Reproduce:**\n1. \n\n**Logs:**\n',
  },
  {
    id: 'visual',
    name: 'Visual Bug',
    template: '**Issue:**\n\n**Browser:**\n\n**Screenshot:**\n\n**Expected Design:**\n',
  },
];

function loadBugTemplates(): BugTemplate[] {
  const saved = localStorage.getItem('bug-templates');
  if (!saved) return DEFAULT_BUG_TEMPLATES;
  try {
    return JSON.parse(saved) as BugTemplate[];
  } catch {
    return DEFAULT_BUG_TEMPLATES;
  }
}

interface Props {
  test: Test;
  result: TestResult;
  onStatusChange: (status: 'pass' | 'fail' | 'skip') => void;
  onBugsChange: (bugs: string) => void;
  bulkMode?: boolean;
  isSelected?: boolean;
  onSelectionChange?: (selected: boolean) => void;
  isCurrent?: boolean;
  showTimer?: boolean;
}

export const TestItem = React.memo(function TestItem({
  test,
  result,
  onStatusChange,
  onBugsChange,
  bulkMode = false,
  isSelected = false,
  onSelectionChange,
  isCurrent = false,
  showTimer = false,
}: Props) {
  const { t, i18n } = useTranslation('ui');
  const { status, bugs, updated_at } = result;

  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const bugTemplates = loadBugTemplates();

  const getBorderColor = (): string => {
    if (isCurrent) return 'var(--color-primary)';
    if (status === 'pass') return 'var(--color-success)';
    if (status === 'fail') return 'var(--color-error)';
    if (status === 'skip') return 'var(--color-warning)';
    return 'var(--color-border)';
  };

  const statusIcon = (): React.ReactNode => {
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

  const handleContextMenu = (e: React.MouseEvent): void => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const contextActions: QuickAction[] = [
    {
      label: t('session.copyTestName'),
      icon: <Copy size={14} />,
      onClick: () => { void navigator.clipboard.writeText(test.title); },
    },
    {
      label: t('session.statusPass'),
      icon: <Check size={14} color="var(--color-success)" />,
      onClick: () => onStatusChange('pass'),
      shortcut: '1',
    },
    {
      label: t('session.statusFail'),
      icon: <X size={14} color="var(--color-error)" />,
      onClick: () => onStatusChange('fail'),
      shortcut: '2',
    },
    {
      label: t('session.statusSkip'),
      icon: <Minus size={14} color="var(--color-warning)" />,
      onClick: () => onStatusChange('skip'),
      shortcut: '3',
    },
  ];

  return (
    <div
      data-test-path={test.path}
      className="card"
      onContextMenu={handleContextMenu}
      style={{
        borderLeft: `3px solid ${getBorderColor()}`,
        marginBottom: 'var(--space-md)',
        transition: 'border-color var(--transition-base)',
        padding: 'var(--space-lg)',
        outline: isCurrent ? '2px solid var(--color-primary)' : undefined,
        outlineOffset: isCurrent ? '1px' : undefined,
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
        {bulkMode && (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelectionChange?.(e.target.checked)}
            style={{ marginTop: '3px', flexShrink: 0, cursor: 'pointer' }}
            onClick={(e) => e.stopPropagation()}
          />
        )}
        <div style={{ flexShrink: 0, marginTop: '2px' }}>{statusIcon()}</div>
        <div style={{ flex: 1 }}>
          <h4 style={{ margin: 0 }}>{test.title}</h4>
          {showTimer && (
            <div style={{ marginTop: 'var(--space-sm)' }}>
              <TestTimer testPath={test.path} />
            </div>
          )}
        </div>
        {(status === 'pass' || status === 'fail' || status === 'skip') && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', flexShrink: 0 }}>
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

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
        <button onClick={() => onStatusChange('pass')} className="btn-secondary" style={{ flex: 1, ...passStyle }}>
          <Check size={16} />
          {t('session.statusPass')}
        </button>
        <button onClick={() => onStatusChange('fail')} className="btn-secondary" style={{ flex: 1, ...failStyle }}>
          <X size={16} />
          {t('session.statusFail')}
        </button>
        <button onClick={() => onStatusChange('skip')} className="btn-secondary" style={{ flex: 1, ...skipStyle }}>
          <Minus size={16} />
          {t('session.statusSkip')}
        </button>
      </div>

      {/* Bugs textarea (when failed) */}
      {status === 'fail' && (
        <div style={{ marginTop: 'var(--space-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-sm)' }}>
            <label style={{ margin: 0 }}>{t('session.bugs')}</label>
            <select
              defaultValue=""
              onChange={(e) => {
                if (!e.target.value) return;
                const tpl = bugTemplates.find(bt => bt.id === e.target.value);
                if (tpl) onBugsChange(tpl.template);
                e.target.value = '';
              }}
              style={{ fontSize: 'var(--text-sm)', padding: '2px 6px' }}
            >
              <option value="">{t('session.selectTemplate')}</option>
              {bugTemplates.map(bt => (
                <option key={bt.id} value={bt.id}>{bt.name}</option>
              ))}
            </select>
          </div>
          <textarea
            value={bugs}
            onChange={(e) => onBugsChange(e.target.value)}
            placeholder={t('session.bugDescription')}
            rows={3}
            style={{ resize: 'vertical' }}
          />
        </div>
      )}

      {/* Context menu */}
      {contextMenu && (
        <QuickActionsMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          actions={contextActions}
        />
      )}
    </div>
  );
});
