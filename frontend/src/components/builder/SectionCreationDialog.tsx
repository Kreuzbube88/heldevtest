import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';

interface Props {
  onClose: () => void;
  onCreate: (section: { title: string; type: 'tests' | 'freetext' }) => void;
}

export function SectionCreationDialog({ onClose, onCreate }: Props) {
  const { t } = useTranslation();
  const [title, setTitle] = useState<string>('');
  const [type, setType] = useState<'tests' | 'freetext'>('tests');
  const [error, setError] = useState<string>('');

  const handleCreate = (): void => {
    console.log('🔧 Dialog.handleCreate called', { title, type });

    if (!title.trim()) {
      console.log('❌ Validation failed: empty title');
      setError(t('ui:builder.sectionTitleRequired'));
      return;
    }

    console.log('✅ Calling onCreate');
    onCreate({ title: title.trim(), type });
    console.log('✅ Calling onClose');
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter') handleCreate();
    if (e.key === 'Escape') onClose();
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <div
        className="card"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        style={{ width: '500px', padding: 0, overflow: 'hidden' }}
      >
        <div style={{ padding: 'var(--space-lg) var(--space-xl)', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0, fontSize: 'var(--text-xl)' }}>{t('ui:builder.createSection')}</h2>
          <button onClick={onClose} className="btn-ghost" style={{ padding: 'var(--space-xs)' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: 'var(--space-xl)' }}>
          <div style={{ marginBottom: 'var(--space-lg)' }}>
            <label style={{ display: 'block', marginBottom: 'var(--space-sm)', fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--text-sm)' }}>
              {t('ui:builder.sectionTitle')}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
              onKeyDown={handleKeyDown}
              placeholder={t('ui:builder.sectionTitlePlaceholder')}
              autoFocus
              style={{ width: '100%' }}
            />
            {error && (
              <p style={{ margin: '4px 0 0', fontSize: 'var(--text-sm)', color: 'var(--color-error)' }}>{error}</p>
            )}
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 'var(--space-sm)', fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--text-sm)' }}>
              {t('ui:builder.sectionType')}
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              {(['tests', 'freetext'] as const).map(opt => (
                <label
                  key={opt}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 'var(--space-md)',
                    padding: 'var(--space-md)',
                    border: `2px solid ${type === opt ? 'var(--color-primary-solid)' : 'var(--color-border)'}`,
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    background: type === opt ? 'var(--color-bg-tertiary)' : 'transparent',
                    transition: 'border-color var(--transition-fast)'
                  }}
                >
                  <input
                    type="radio"
                    name="sectionType"
                    value={opt}
                    checked={type === opt}
                    onChange={() => setType(opt)}
                  />
                  <div>
                    <div style={{ fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--text-sm)' }}>
                      {t(`ui:builder.type${opt === 'tests' ? 'Tests' : 'Freetext'}`)}
                    </div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                      {t(`ui:builder.type${opt === 'tests' ? 'Tests' : 'Freetext'}Description`)}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div style={{ padding: 'var(--space-md) var(--space-xl)', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-sm)' }}>
          <button onClick={onClose} className="btn-secondary">{t('common:cancel')}</button>
          <button onClick={handleCreate} className="btn-primary">{t('ui:builder.create')}</button>
        </div>
      </div>
    </div>
  );
}
