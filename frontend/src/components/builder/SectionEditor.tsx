import { useTranslation } from 'react-i18next';
import type { BuilderSection } from '../../types';
import { useUIStore } from '../../stores/uiStore';
import { TestEditor } from './TestEditor';
import { FreetextEditor } from './FreetextEditor';

interface Props {
  sections: BuilderSection[];
  onUpdate: (sections: BuilderSection[]) => void;
}

export function SectionEditor({ sections, onUpdate }: Props) {
  const { t } = useTranslation();
  const { openConfirm } = useUIStore();

  const addSection = () => {
    const newSection: BuilderSection = {
      id: crypto.randomUUID(),
      title: '',
      type: 'tests',
      tests: []
    };
    onUpdate([...sections, newSection]);
  };

  const updateSection = (id: string, updates: Partial<BuilderSection>) => {
    onUpdate(sections.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const removeSection = (id: string) => {
    openConfirm(
      t('ui:builder.confirmDeleteTitle'),
      t('ui:builder.confirmDeleteMsg'),
      () => onUpdate(sections.filter(s => s.id !== id))
    );
  };

  return (
    <div>
      <h2 style={{ marginBottom: 'var(--space-md)' }}>{t('ui:builder.sections')}</h2>

      {sections.map(section => (
        <div
          key={section.id}
          className="card"
          style={{
            marginBottom: 'var(--space-md)',
            borderLeft: `4px solid ${
              section.type === 'tests'
                ? 'var(--color-primary-solid)'
                : 'var(--color-warning)'
            }`
          }}
        >
          <input
            value={section.title}
            onChange={(e) => updateSection(section.id, { title: e.target.value })}
            placeholder={t('ui:builder.sectionTitle')}
            style={{ marginBottom: 'var(--space-md)', width: '100%' }}
          />

          <select
            value={section.type}
            onChange={(e) => {
              const type = e.target.value as 'tests' | 'freetext';
              updateSection(section.id, {
                type,
                tests: type === 'tests' ? [] : undefined,
                content: type === 'freetext' ? '' : undefined
              });
            }}
            style={{ marginBottom: 'var(--space-md)' }}
          >
            <option value="tests">{t('ui:builder.typeTests')}</option>
            <option value="freetext">{t('ui:builder.typeFreetext')}</option>
          </select>

          {section.type === 'tests' ? (
            <TestEditor
              section={section}
              onUpdate={(updates) => updateSection(section.id, updates)}
            />
          ) : (
            <FreetextEditor
              section={section}
              onUpdate={(updates) => updateSection(section.id, updates)}
            />
          )}

          <button
            onClick={() => removeSection(section.id)}
            className="btn-ghost"
            style={{ color: 'var(--color-error)', marginTop: 'var(--space-md)' }}
          >
            {t('ui:builder.deleteSection')}
          </button>
        </div>
      ))}

      <button onClick={addSection} className="btn-primary">
        + {t('ui:builder.addSection')}
      </button>
    </div>
  );
}
