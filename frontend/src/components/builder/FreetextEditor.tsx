import { useTranslation } from 'react-i18next';
import type { BuilderSection } from '../../types';

interface Props {
  section: BuilderSection;
  onUpdate: (updates: Partial<BuilderSection>) => void;
}

export function FreetextEditor({ section, onUpdate }: Props) {
  const { t } = useTranslation();

  return (
    <div>
      <h4 style={{ marginBottom: 'var(--space-sm)' }}>{t('ui:builder.content')}</h4>
      <textarea
        value={section.content ?? ''}
        onChange={(e) => onUpdate({ content: e.target.value })}
        placeholder={t('ui:builder.contentPlaceholder')}
        rows={8}
        style={{
          width: '100%',
          padding: 'var(--space-md)',
          fontSize: 'var(--text-base)',
          fontFamily: 'inherit',
          border: '2px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          resize: 'vertical',
          boxSizing: 'border-box'
        }}
      />
    </div>
  );
}
