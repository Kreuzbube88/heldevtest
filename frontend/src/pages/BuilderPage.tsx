import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, Save } from 'lucide-react';
import { Header } from '../components/Header';
import { BackgroundLogo } from '../components/BackgroundLogo';
import { SectionEditor } from '../components/builder/SectionEditor';
import { MarkdownPreview } from '../components/builder/MarkdownPreview';
import { useUIStore } from '../stores/uiStore';
import { api } from '../api/api';
import type { BuilderSection } from '../types';

function generateMarkdown(testName: string, sections: BuilderSection[]): string {
  let md = `# ${testName || 'Untitled Test'}\n\n`;

  sections.forEach(section => {
    md += `## ${section.title || 'Untitled Section'}\n\n`;

    if (section.type === 'tests') {
      section.tests?.forEach(test => {
        md += `- [ ] ${test.name}\n`;
      });
      md += '\n';
    } else {
      md += `${section.content ?? ''}\n\n`;
    }
  });

  return md;
}

interface SaveDialogState {
  name: string;
  description: string;
}

export function BuilderPage() {
  const { t } = useTranslation();
  const { addToast } = useUIStore();

  const [testName, setTestName] = useState('');
  const [sections, setSections] = useState<BuilderSection[]>([]);

  useEffect(() => {
    console.log('📊 BuilderPage sections changed:', sections);
  }, [sections]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveDialog, setSaveDialog] = useState<SaveDialogState>({ name: '', description: '' });
  const [isSaving, setIsSaving] = useState(false);

  const handleDownload = () => {
    const md = generateMarkdown(testName, sections);
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${testName || 'test'}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveConfirm = async () => {
    if (!saveDialog.name.trim()) return;

    setIsSaving(true);
    try {
      await api.createTemplate({
        name: saveDialog.name.trim(),
        description: saveDialog.description.trim(),
        content: generateMarkdown(testName, sections)
      });
      addToast('success', t('ui:toast.templateCreated'));
      setShowSaveDialog(false);
      setSaveDialog({ name: '', description: '' });
    } catch {
      addToast('error', t('ui:toast.error'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <BackgroundLogo />
      <Header />

      {showSaveDialog && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="card" style={{ width: '400px', maxWidth: '90vw' }}>
            <h2 style={{ marginBottom: 'var(--space-lg)' }}>{t('ui:builder.saveDialogTitle')}</h2>

            <label style={{ display: 'block', marginBottom: 'var(--space-sm)', fontWeight: 600 }}>
              {t('ui:builder.saveDialogNameLabel')}
            </label>
            <input
              value={saveDialog.name}
              onChange={(e) => setSaveDialog(s => ({ ...s, name: e.target.value }))}
              placeholder={t('ui:builder.saveDialogNamePlaceholder')}
              onKeyDown={(e) => e.key === 'Enter' && void handleSaveConfirm()}
              style={{ width: '100%', marginBottom: 'var(--space-md)', boxSizing: 'border-box' }}
              autoFocus
            />

            <label style={{ display: 'block', marginBottom: 'var(--space-sm)', fontWeight: 600 }}>
              {t('ui:builder.saveDialogDescLabel')}
            </label>
            <input
              value={saveDialog.description}
              onChange={(e) => setSaveDialog(s => ({ ...s, description: e.target.value }))}
              placeholder={t('ui:builder.saveDialogDescPlaceholder')}
              style={{ width: '100%', marginBottom: 'var(--space-xl)', boxSizing: 'border-box' }}
            />

            <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'flex-end' }}>
              <button
                onClick={() => { setShowSaveDialog(false); setSaveDialog({ name: '', description: '' }); }}
                className="btn-secondary"
                disabled={isSaving}
              >
                {t('common:cancel')}
              </button>
              <button
                onClick={() => { void handleSaveConfirm(); }}
                className="btn-primary"
                disabled={isSaving || !saveDialog.name.trim()}
              >
                {t('ui:builder.saveDialogConfirm')}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ marginBottom: 'var(--space-xl)' }}>
          <h1 style={{ marginBottom: 'var(--space-md)' }}>{t('ui:builder.title')}</h1>
          <input
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
            placeholder={t('ui:builder.testNamePlaceholder')}
            style={{ width: '100%', maxWidth: '500px' }}
          />
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'var(--space-xl)',
          minHeight: '500px'
        }}>
          <div>
            <SectionEditor sections={sections} onUpdate={setSections} />
          </div>
          <div>
            <MarkdownPreview testName={testName} sections={sections} />
          </div>
        </div>

        <div style={{
          marginTop: 'var(--space-xl)',
          display: 'flex',
          gap: 'var(--space-md)'
        }}>
          <button onClick={handleDownload} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <Download size={20} />
            {t('ui:builder.download')}
          </button>
          <button onClick={() => setShowSaveDialog(true)} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <Save size={20} />
            {t('ui:builder.saveTemplate')}
          </button>
        </div>
      </div>
    </div>
  );
}
