import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUIStore } from '../stores/uiStore';
import { api } from '../api/api';
import { Header } from '../components/Header';
import { FileText, Trash2 } from 'lucide-react';
import type { Template } from '../types';

export function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const { addToast, openConfirm } = useUIStore();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const loadTemplates = useCallback(async () => {
    try {
      const data = await api.getTemplates() as Template[];
      setTemplates(data);
    } catch {
      addToast('error', t('ui:toast.error'));
    }
  }, [addToast, t]);

  useEffect(() => {
    void loadTemplates();
  }, [loadTemplates]);

  const handleUseTemplate = async (template: Template) => {
    const blob = new Blob([template.content], { type: 'text/markdown' });
    const file = new File([blob], `${template.name}.md`, { type: 'text/markdown' });

    try {
      const session = await api.uploadTest(file) as { id: number };
      navigate(`/session/${session.id}`);
    } catch {
      addToast('error', t('ui:toast.error'));
    }
  };

  const handleDelete = (id: number) => {
    openConfirm(
      t('ui:templates.deleteTemplate'),
      t('ui:templates.deleteConfirm'),
      () => {
        void (async () => {
          try {
            await api.deleteTemplate(id);
            addToast('success', t('ui:toast.deleteSuccess'));
            void loadTemplates();
          } catch {
            addToast('error', t('ui:toast.error'));
          }
        })();
      }
    );
  };

  return (
    <div>
      <Header />
      <div className="container">
        <h1 style={{ marginBottom: 'var(--space-lg)' }}>{t('ui:templates.title')}</h1>

        {templates.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: 'var(--space-xl)', color: 'var(--color-text-secondary)' }}>
            {t('ui:templates.noTemplates')}
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
            {templates.map(template => (
              <div key={template.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <h3>{template.name}</h3>
                  <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-xs)' }}>
                    {template.description}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                  <button className="btn-primary" onClick={() => { void handleUseTemplate(template); }} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
                    <FileText size={16} />
                    {t('ui:templates.useTemplate')}
                  </button>
                  <button className="btn-danger" onClick={() => handleDelete(template.id)}>
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
