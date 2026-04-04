import { useEffect, useRef } from 'react';

export interface QuickAction {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  shortcut?: string;
}

interface Props {
  x: number;
  y: number;
  onClose: () => void;
  actions: QuickAction[];
}

export function QuickActionsMenu({ x, y, onClose, actions }: Props) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent): void => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleEscape = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  // Adjust position if menu would overflow viewport
  const adjustedX = Math.min(x, window.innerWidth - 220);
  const adjustedY = Math.min(y, window.innerHeight - actions.length * 40 - 20);

  return (
    <div
      ref={menuRef}
      className="glass"
      style={{
        position: 'fixed',
        top: adjustedY,
        left: adjustedX,
        zIndex: 'var(--z-dropdown)' as unknown as number,
        minWidth: '200px',
        padding: 'var(--space-xs)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-xl)',
        border: '1px solid var(--color-border)',
      }}
    >
      {actions.map((action, i) => (
        <button
          key={i}
          onClick={() => { action.onClick(); onClose(); }}
          className="btn-ghost"
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-sm)',
            padding: 'var(--space-sm) var(--space-md)',
            textAlign: 'left',
            borderRadius: 'var(--radius-sm)',
          }}
        >
          {action.icon}
          <span style={{ flex: 1 }}>{action.label}</span>
          {action.shortcut && (
            <kbd style={{
              fontSize: 'var(--text-xs)',
              padding: '2px 5px',
              background: 'var(--color-bg-tertiary)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-secondary)',
            }}>
              {action.shortcut}
            </kbd>
          )}
        </button>
      ))}
    </div>
  );
}
