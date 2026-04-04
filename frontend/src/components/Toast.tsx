import { useUIStore } from '../stores/uiStore';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export function Toast() {
  const { toasts, removeToast } = useUIStore();

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle
  };

  return (
    <div style={{
      position: 'fixed',
      top: 'var(--space-lg)',
      right: 'var(--space-lg)',
      zIndex: 'var(--z-toast)' as React.CSSProperties['zIndex'],
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-sm)'
    }}>
      {toasts.map(toast => {
        const Icon = icons[toast.type];
        return (
          <div
            key={toast.id}
            style={{
              background: 'var(--color-bg)',
              padding: 'var(--space-md)',
              borderRadius: 'var(--border-radius)',
              boxShadow: 'var(--shadow-lg)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-sm)',
              minWidth: '300px',
              borderLeft: `4px solid var(--color-${toast.type})`
            }}
          >
            <Icon size={20} color={`var(--color-${toast.type})`} />
            <span style={{ flex: 1 }}>{toast.message}</span>
            <button onClick={() => removeToast(toast.id)} style={{ padding: 'var(--space-xs)' }}>
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
