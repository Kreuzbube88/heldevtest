import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { BuilderSection } from '../../types';

interface Props {
  testName: string;
  sections: BuilderSection[];
}

export function MarkdownPreview({ testName, sections }: Props) {
  const { t } = useTranslation();
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    let md = `# ${testName || 'Untitled Test'}\n\n`;

    sections.forEach(section => {
      md += `## ${section.title || 'Untitled Section'}\n\n`;

      if (section.type === 'tests') {
        if (section.tests && section.tests.length > 0) {
          section.tests.forEach(test => {
            md += `- [ ] ${test.name}\n`;
          });
          md += '\n';
        }
      } else {
        md += `${section.content ?? ''}\n\n`;
      }
    });

    setMarkdown(md);
  }, [testName, sections]);

  return (
    <div
      className="card"
      style={{
        background: 'var(--color-bg-secondary)',
        height: '100%',
        position: 'sticky',
        top: 'var(--space-lg)'
      }}
    >
      <h2 style={{ marginBottom: 'var(--space-md)' }}>{t('ui:builder.preview')}</h2>
      <pre
        style={{
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
          fontSize: 'var(--text-sm)',
          fontFamily: 'monospace',
          background: 'var(--color-bg-primary)',
          padding: 'var(--space-md)',
          borderRadius: 'var(--radius-md)',
          maxHeight: '600px',
          overflowY: 'auto',
          margin: 0
        }}
      >
        {markdown}
      </pre>
    </div>
  );
}
