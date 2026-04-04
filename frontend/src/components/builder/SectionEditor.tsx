import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { BuilderSection } from '../../types/index.js';
import { useUIStore } from '../../stores/uiStore.js';
import { TestEditor } from './TestEditor.js';
import { FreetextEditor } from './FreetextEditor.js';
import { SectionCreationDialog } from './SectionCreationDialog.js';

interface Props {
  sections: BuilderSection[];
  onUpdate: (sections: BuilderSection[]) => void;
}

export function SectionEditor({ sections, onUpdate }: Props) {
  const { t } = useTranslation();
  const { openConfirm } = useUIStore();
  const [showDialog, setShowDialog] = useState<boolean>(false);

  const handleCreate = (data: { title: string; type: 'tests' | 'freetext' }): void => {
    const newSection: BuilderSection = {
      id: crypto.randomUUID(),
      title: data.title,
      type: data.type,
      tests: data.type === 'tests' ? [] : undefined,
      content: data.type === 'freetext' ? '' : undefined
    };
    onUpdate([...sections, newSection]);
  };

  const updateSection = (id: string, updates: Partial<BuilderSection>): void => {
    onUpdate(sections.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const moveSection = (index: number, direction: 'up' | 'down'): void => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= sections.length) return;
    const next = [...sections];
    [next[index], next[target]] = [next[target], next[index]];
    onUpdate(next);
  };

  const removeSection = (id: string): void => {
    openConfirm(
      t('ui:builder.confirmDeleteTitle'),
      t('ui:builder.confirmDeleteMsg'),
      () => onUpdate(sections.filter(s => s.id !== id))
    );
  };

  return (
    <div>
      <h2 style={{ marginBottom: 'var(--space-md)' }}>{t('ui:builder.sections')}</h2>

      {sections.map((section, index) => (
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
            <input
              value={section.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSection(section.id, { title: e.target.value })}
              placeholder={t('ui:builder.sectionTitle')}
              style={{ flex: 1 }}
            />
            <div style={{ display: 'flex', gap: 'var(--space-xs)', flexShrink: 0 }}>
              <button
                onClick={() => moveSection(index, 'up')}
                disabled={index === 0}
                className="btn-ghost"
                title={t('ui:builder.moveUp')}
                style={{ padding: 'var(--space-xs) var(--space-sm)', opacity: index === 0 ? 0.3 : 1 }}
              >
                ↑
              </button>
              <button
                onClick={() => moveSection(index, 'down')}
                disabled={index === sections.length - 1}
                className="btn-ghost"
                title={t('ui:builder.moveDown')}
                style={{ padding: 'var(--space-xs) var(--space-sm)', opacity: index === sections.length - 1 ? 0.3 : 1 }}
              >
                ↓
              </button>
            </div>
          </div>

          <select
            value={section.type}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
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

      <button onClick={() => setShowDialog(true)} className="btn-primary">
        + {t('ui:builder.addSection')}
      </button>

      {showDialog && (
        <SectionCreationDialog
          onClose={() => setShowDialog(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}
