import { useEffect, useRef } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Circle } from 'lucide-react';

interface TestProgressProps {
  total: number;
  passed: number;
  failed: number;
  inProgress: number;
  notStarted: number;
}

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function TestProgress({ total, passed, failed, inProgress, notStarted }: TestProgressProps) {
  const allPassedRef = useRef(false);
  const completionPct = total > 0 ? Math.round((passed / total) * 100) : 0;
  const allPassed = total > 0 && passed === total && failed === 0;
  const dashOffset = CIRCUMFERENCE * (1 - completionPct / 100);

  useEffect(() => {
    if (allPassed && !allPassedRef.current) {
      allPassedRef.current = true;
      spawnConfetti();
    }
    if (!allPassed) {
      allPassedRef.current = false;
    }
  }, [allPassed]);

  const spawnConfetti = () => {
    const colors = ['#10b981', '#f59e0b', '#ef4444', '#667eea', '#764ba2'];
    for (let i = 0; i < 60; i++) {
      const el = document.createElement('div');
      el.style.cssText = `
        position: fixed;
        width: ${6 + Math.random() * 8}px;
        height: ${6 + Math.random() * 8}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        left: ${Math.random() * 100}%;
        top: -20px;
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        z-index: 9999;
        pointer-events: none;
        animation: confetti ${2 + Math.random() * 2}s linear ${Math.random() * 0.5}s both;
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 4500);
    }
  };

  const progressColor = failed > 0
    ? 'var(--color-error)'
    : inProgress > 0
      ? 'var(--color-warning)'
      : allPassed
        ? 'var(--color-success)'
        : 'url(#progressGradient)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xl)' }}>
        {/* SVG Progress Ring */}
        <div style={{ flexShrink: 0, position: 'relative', width: 128, height: 128 }}>
          <svg width="128" height="128" viewBox="0 0 128 128">
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#667eea" />
                <stop offset="100%" stopColor="#764ba2" />
              </linearGradient>
            </defs>
            {/* Track */}
            <circle
              cx="64"
              cy="64"
              r={RADIUS}
              fill="none"
              stroke="var(--color-bg-tertiary)"
              strokeWidth="10"
            />
            {/* Progress */}
            <circle
              cx="64"
              cy="64"
              r={RADIUS}
              fill="none"
              stroke={progressColor}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
              transform="rotate(-90 64 64)"
              style={{ transition: 'stroke-dashoffset var(--transition-slow), stroke var(--transition-base)' }}
            />
          </svg>
          {/* Center label */}
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-2xl)',
              fontWeight: 800,
              color: 'var(--color-text-primary)',
              lineHeight: 1,
            }}>
              {completionPct}%
            </span>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: 2 }}>
              done
            </span>
          </div>
        </div>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)', flex: 1 }}>
          {[
            { icon: CheckCircle2, count: passed, label: 'Passed', color: 'var(--color-success)', bg: 'var(--color-success-bg)' },
            { icon: XCircle, count: failed, label: 'Failed', color: 'var(--color-error)', bg: 'var(--color-error-bg)' },
            { icon: AlertCircle, count: inProgress, label: 'Running', color: 'var(--color-warning)', bg: 'var(--color-warning-bg)' },
            { icon: Circle, count: notStarted, label: 'Pending', color: 'var(--color-info)', bg: 'var(--color-info-bg)' },
          ].map(({ icon: Icon, count, label, color, bg }) => (
            <div key={label} style={{
              background: bg,
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-sm) var(--space-md)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-sm)',
            }}>
              <Icon size={18} color={color} />
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-xl)', color: 'var(--color-text-primary)', lineHeight: 1 }}>
                  {count}
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                  {label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {allPassed && (
        <div style={{
          textAlign: 'center',
          padding: 'var(--space-md)',
          background: 'var(--color-success-bg)',
          border: '1px solid var(--color-success-border)',
          borderRadius: 'var(--radius-lg)',
          color: 'var(--color-success)',
          fontWeight: 'var(--font-weight-semibold)',
          animation: 'slideUp var(--transition-base) both',
        }}>
          🎉 All Tests Passed! Excellent Work!
        </div>
      )}
    </div>
  );
}
