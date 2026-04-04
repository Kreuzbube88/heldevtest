import { useState, useEffect, useRef } from 'react';
import { Palette } from 'lucide-react';
import { accentColors, applyAccentColor, getStoredAccentColor, saveAccentColor } from '../utils/accentColors.js';
import type { AccentColor } from '../utils/accentColors.js';

export function AccentColorSwitcher() {
  const [currentColor, setCurrentColor] = useState<AccentColor>(getStoredAccentColor);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    applyAccentColor(currentColor);
    saveAccentColor(currentColor);
  }, [currentColor]);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleColorChange = (color: AccentColor) => {
    setCurrentColor(color);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Change accent color"
        style={{
          background: accentColors[currentColor].primary,
          border: '2px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          width: '36px',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all var(--transition-base)',
          color: 'white',
        }}
      >
        <Palette size={18} />
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          right: 0,
          background: 'var(--color-bg-secondary)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-md)',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 1000,
          minWidth: '180px',
        }}>
          <div style={{
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-secondary)',
            marginBottom: 'var(--space-sm)',
            fontWeight: 600,
          }}>
            Accent Color
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)' }}>
            {(Object.keys(accentColors) as AccentColor[]).map(color => (
              <button
                key={color}
                onClick={() => handleColorChange(color)}
                style={{
                  padding: 'var(--space-sm)',
                  border: currentColor === color
                    ? '3px solid var(--color-primary-solid)'
                    : '2px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  background: accentColors[color].primary,
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  height: '52px',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                }}
              >
                <span style={{
                  fontSize: '11px',
                  color: 'white',
                  fontWeight: 700,
                  textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                }}>
                  {accentColors[color].name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
