import { useUIStore } from '../stores/uiStore';
import { useTranslation } from 'react-i18next';

export function ConfirmDialog() {
  const { confirmDialog, closeConfirm } = useUIStore();
  const { t } = useTranslation();

  if (!confirmDialog?.open) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 'var(--z-modal)' as React.CSSProperties['zIndex'],
      backdropFilter: 'blur(4px)',
      animation: 'fadeIn var(--transition-fast) both'
    }}>
      <div className="card animate-scaleIn" style={{ minWidth: '400px' }}>
        <h2 style={{ marginBottom: 'var(--space-md)' }}>{confirmDialog.title}</h2>
        {confirmDialog.message && (
          <p style={{ marginBottom: 'var(--space-lg)', color: 'var(--color-text-secondary)' }}>
            {confirmDialog.message}
          </p>
        )}
        <div style={{ display: 'flex', gap: 'var(--space-sm)', justifyContent: 'flex-end' }}>
          <button className="btn-secondary" onClick={closeConfirm}>
            {t('cancel')}
          </button>
          <button className="btn-danger" onClick={() => {
            confirmDialog.onConfirm();
            closeConfirm();
          }}>
            {t('confirm')}
          </button>
        </div>
      </div>
    </div>
  );
}
