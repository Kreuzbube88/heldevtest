import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      style={{
        position: 'relative',
        width: '40px',
        height: '40px',
        borderRadius: 'var(--radius-full)',
        background: 'var(--color-bg-tertiary)',
        border: '1px solid var(--color-border)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        flexShrink: 0,
      }}
    >
      <span
        style={{
          position: 'absolute',
          display: 'flex',
          color: 'var(--color-warning)',
          opacity: theme === 'light' ? 1 : 0,
          transform: theme === 'light' ? 'rotate(0deg) scale(1)' : 'rotate(90deg) scale(0)',
          transition: 'all var(--transition-base)',
        }}
      >
        <Sun size={18} />
      </span>
      <span
        style={{
          position: 'absolute',
          display: 'flex',
          color: 'var(--color-info)',
          opacity: theme === 'dark' ? 1 : 0,
          transform: theme === 'dark' ? 'rotate(0deg) scale(1)' : 'rotate(-90deg) scale(0)',
          transition: 'all var(--transition-base)',
        }}
      >
        <Moon size={18} />
      </span>
    </button>
  );
}
