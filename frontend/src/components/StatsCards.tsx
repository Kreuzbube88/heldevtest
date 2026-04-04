import { CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Props {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  activeSessions: number;
}

export function StatsCards({ totalTests, passedTests, failedTests, activeSessions }: Props) {
  const { t } = useTranslation();
  const passRate = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: 'var(--space-lg)',
      marginBottom: 'var(--space-2xl)'
    }}>
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
        borderTop: '4px solid var(--color-primary-solid)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--color-text-tertiary)',
              fontWeight: 'var(--font-weight-semibold)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: 'var(--space-xs)'
            }}>
              {t('ui:dashboard.statsTotalTests')}
            </div>
            <div style={{
              fontSize: 'var(--text-4xl)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-primary-solid)',
              lineHeight: 1
            }}>
              {totalTests}
            </div>
          </div>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: 'var(--radius-xl)',
            background: 'var(--color-primary-solid)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.2
          }}>
            <TrendingUp size={32} />
          </div>
        </div>
      </div>

      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
        borderTop: '4px solid var(--color-success)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--color-text-tertiary)',
              fontWeight: 'var(--font-weight-semibold)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: 'var(--space-xs)'
            }}>
              {t('ui:dashboard.statsPassed')}
            </div>
            <div style={{
              fontSize: 'var(--text-4xl)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-success)',
              lineHeight: 1
            }}>
              {passedTests}
            </div>
            <div style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--color-success)',
              marginTop: 'var(--space-xs)',
              fontWeight: 'var(--font-weight-semibold)'
            }}>
              {passRate}% {t('ui:dashboard.successRate')}
            </div>
          </div>
          <CheckCircle size={64} color="var(--color-success)" style={{ opacity: 0.2 }} />
        </div>
      </div>

      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)',
        borderTop: '4px solid var(--color-error)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--color-text-tertiary)',
              fontWeight: 'var(--font-weight-semibold)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: 'var(--space-xs)'
            }}>
              {t('ui:dashboard.statsFailed')}
            </div>
            <div style={{
              fontSize: 'var(--text-4xl)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-error)',
              lineHeight: 1
            }}>
              {failedTests}
            </div>
          </div>
          <XCircle size={64} color="var(--color-error)" style={{ opacity: 0.2 }} />
        </div>
      </div>

      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)',
        borderTop: '4px solid var(--color-warning)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--color-text-tertiary)',
              fontWeight: 'var(--font-weight-semibold)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: 'var(--space-xs)'
            }}>
              {t('ui:dashboard.statsActiveSessions')}
            </div>
            <div style={{
              fontSize: 'var(--text-4xl)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-warning)',
              lineHeight: 1
            }}>
              {activeSessions}
            </div>
          </div>
          <Clock size={64} color="var(--color-warning)" style={{ opacity: 0.2 }} />
        </div>
      </div>
    </div>
  );
}
