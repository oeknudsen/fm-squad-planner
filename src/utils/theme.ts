const THEME_KEY = 'fm-squad-planner-theme';

export type Theme = 'light' | 'dark';

export function getTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  const stored = localStorage.getItem(THEME_KEY) as Theme;
  return stored || 'light';
}

export function setTheme(theme: Theme): void {
  localStorage.setItem(THEME_KEY, theme);
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

export function initTheme(): void {
  const theme = getTheme();
  setTheme(theme);
}

