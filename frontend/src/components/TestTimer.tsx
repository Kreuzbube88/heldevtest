import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Clock } from 'lucide-react';

interface Props {
  testPath: string;
  onTimeUpdate?: (seconds: number) => void;
}

export function TestTimer({ testPath, onTimeUpdate }: Props) {
  const { t } = useTranslation('ui');
  const storageKey = `timer-${testPath}`;

  const [seconds, setSeconds] = useState<number>(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? Number(saved) : 0;
  });
  const [isRunning, setIsRunning] = useState<boolean>(false);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setSeconds(s => {
        const next = s + 1;
        localStorage.setItem(storageKey, String(next));
        onTimeUpdate?.(next);
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, onTimeUpdate, storageKey]);

  const formatTime = (secs: number): string => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem.toString().padStart(2, '0')}`;
  };

  const handleReset = (): void => {
    setSeconds(0);
    setIsRunning(false);
    localStorage.removeItem(storageKey);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
      <Clock size={14} color="var(--color-text-tertiary)" />
      <span style={{
        fontSize: 'var(--text-sm)',
        color: 'var(--color-text-tertiary)',
        fontVariantNumeric: 'tabular-nums',
        minWidth: '36px'
      }}>
        {formatTime(seconds)}
      </span>
      <button onClick={() => setIsRunning(r => !r)} className="btn-ghost" style={{ padding: '2px 6px', fontSize: 'var(--text-xs)' }}>
        {isRunning ? t('session.timerPause') : t('session.timerStart')}
      </button>
      {seconds > 0 && (
        <button onClick={handleReset} className="btn-ghost" style={{ padding: '2px 6px', fontSize: 'var(--text-xs)' }}>
          {t('session.timerReset')}
        </button>
      )}
    </div>
  );
}
