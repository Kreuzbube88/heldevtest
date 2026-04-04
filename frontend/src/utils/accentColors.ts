export type AccentColor = 'purple' | 'blue' | 'green' | 'orange';

export const accentColors = {
  purple: {
    name: 'Purple',
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    primarySolid: '#667eea',
    primaryHover: '#5568d3'
  },
  blue: {
    name: 'Blue',
    primary: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    primarySolid: '#4facfe',
    primaryHover: '#3d8fd9'
  },
  green: {
    name: 'Green',
    primary: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    primarySolid: '#43e97b',
    primaryHover: '#35c768'
  },
  orange: {
    name: 'Orange',
    primary: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    primarySolid: '#fa709a',
    primaryHover: '#e95f87'
  }
} as const;

export function applyAccentColor(color: AccentColor) {
  const colors = accentColors[color];
  document.documentElement.style.setProperty('--color-primary', colors.primary);
  document.documentElement.style.setProperty('--color-primary-solid', colors.primarySolid);
  document.documentElement.style.setProperty('--color-primary-hover', colors.primaryHover);
}

export function getStoredAccentColor(): AccentColor {
  const saved = localStorage.getItem('accentColor');
  return (saved as AccentColor) || 'purple';
}

export function saveAccentColor(color: AccentColor) {
  localStorage.setItem('accentColor', color);
}
