import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import type { BuilderSection, BuilderTest } from '../../types';

interface Props {
  section: BuilderSection;
  onUpdate: (updates: Partial<BuilderSection>) => void;
}

export function TestEditor({ section, onUpdate }: Props) {
  const { t } = useTranslation();
  const [newTestName, setNewTestName] = useState('');

  const addTest = () => {
    if (!newTestName.trim()) return;

    const newTest: BuilderTest = {
      id: crypto.randomUUID(),
      name: newTestName.trim()
    };

    onUpdate({ tests: [...(section.tests ?? []), newTest] });
    setNewTestName('');
  };

  const removeTest = (testId: string) => {
    onUpdate({ tests: section.tests?.filter(t => t.id !== testId) });
  };

  const updateTestName = (testId: string, name: string) => {
    onUpdate({
      tests: section.tests?.map(t => t.id === testId ? { ...t, name } : t)
    });
  };

  return (
    <div>
      <h4 style={{ marginBottom: 'var(--space-sm)' }}>{t('ui:builder.tests')}</h4>

      <div style={{ marginBottom: 'var(--space-md)' }}>
        {section.tests?.map(test => (
          <div
            key={test.id}
            style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-sm)' }}
          >
            <input
              value={test.name}
              onChange={(e) => updateTestName(test.id, e.target.value)}
              style={{ flex: 1 }}
            />
            <button
              onClick={() => removeTest(test.id)}
              className="btn-ghost"
              style={{ padding: 'var(--space-xs)' }}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
        <input
          value={newTestName}
          onChange={(e) => setNewTestName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTest()}
          placeholder={t('ui:builder.newTestPlaceholder')}
          style={{ flex: 1 }}
        />
        <button onClick={addTest} className="btn-primary">
          {t('ui:builder.addTest')}
        </button>
      </div>
    </div>
  );
}
