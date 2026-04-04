import { Github, Heart, FileText, BookOpen, Bug } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Header } from '../components/Header.js';
import { BackgroundLogo } from '../components/BackgroundLogo.js';

export function AboutPage() {
  const { t } = useTranslation(['ui', 'common']);

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <BackgroundLogo />
      <Header />

      <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '800px' }}>
        {/* Logo & Title */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
          <img
            src="/logo.png"
            alt="HELDEVTEST"
            style={{
              width: '700px',
              height: 'auto',
              margin: '0 auto var(--space-xs)',
              display: 'block',
              filter: 'drop-shadow(0 10px 20px rgba(102, 126, 234, 0.3))'
            }}
          />
          <p style={{ fontSize: 'var(--text-xl)', color: 'var(--color-text-secondary)', margin: 0 }}>
            {t('ui:about.tagline')}
          </p>
        </div>

        {/* Description */}
        <div className="card" style={{ marginBottom: 'var(--space-xl)' }}>
          <h2>{t('ui:about.whatIs')}</h2>
          <p>{t('ui:about.description')}</p>
        </div>

        {/* Features */}
        <div className="card" style={{ marginBottom: 'var(--space-xl)' }}>
          <h2>{t('ui:about.features')}</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 'var(--space-md)',
            marginTop: 'var(--space-md)'
          }}>
            {[
              { icon: '📝', text: t('ui:about.feature1') },
              { icon: '✅', text: t('ui:about.feature2') },
              { icon: '💾', text: t('ui:about.feature3') },
              { icon: '📤', text: t('ui:about.feature4') },
              { icon: '📋', text: t('ui:about.feature5') },
              { icon: '🌐', text: t('ui:about.feature6') }
            ].map((feature, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-sm)',
                padding: 'var(--space-sm)',
                background: 'var(--color-bg-tertiary)',
                borderRadius: 'var(--radius-md)'
              }}>
                <span style={{ fontSize: 'var(--text-2xl)' }}>{feature.icon}</span>
                <span style={{ fontSize: 'var(--text-sm)' }}>{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="card">
          <h2>{t('ui:about.links')}</h2>
          <div style={{ display: 'grid', gap: 'var(--space-md)', marginTop: 'var(--space-md)' }}>
            <a
              href="https://github.com/Kreuzbube88/heldevtest"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', justifyContent: 'flex-start', textDecoration: 'none' }}
            >
              <Github size={20} />
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ fontWeight: 'var(--font-weight-semibold)' }}>GitHub Repository</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>Source code, issues, and releases</div>
              </div>
            </a>

            <a
              href="https://github.com/Kreuzbube88/heldevtest/blob/main/README.md"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', justifyContent: 'flex-start', textDecoration: 'none' }}
            >
              <BookOpen size={20} />
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ fontWeight: 'var(--font-weight-semibold)' }}>Documentation</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>Installation, usage, and deployment guides</div>
              </div>
            </a>

            <a
              href="https://github.com/Kreuzbube88/heldevtest/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', justifyContent: 'flex-start', textDecoration: 'none' }}
            >
              <Bug size={20} />
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ fontWeight: 'var(--font-weight-semibold)' }}>Report Issues</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>Bug reports and feature requests</div>
              </div>
            </a>

            <a
              href="https://github.com/Kreuzbube88/heldevtest/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', justifyContent: 'flex-start', textDecoration: 'none' }}
            >
              <FileText size={20} />
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ fontWeight: 'var(--font-weight-semibold)' }}>License</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>MIT License - Free and open source</div>
              </div>
            </a>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: 'var(--space-2xl)',
          paddingTop: 'var(--space-xl)',
          borderTop: '1px solid var(--color-border)',
          color: 'var(--color-text-tertiary)',
          fontSize: 'var(--text-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-xs)' }}>
            Made with <Heart size={16} color="var(--color-error)" fill="var(--color-error)" style={{ margin: '0 4px' }} /> by Kreuzbube88
          </div>
          <div style={{ marginTop: 'var(--space-xs)' }}>
            © {new Date().getFullYear()} HELDEVTEST
          </div>
        </div>
      </div>
    </div>
  );
}
