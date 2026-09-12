import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';
type FontSize = 'small' | 'medium' | 'large';
type Contrast = 'normal' | 'high';

interface AccessibilitySettings {
  theme: Theme;
  fontSize: FontSize;
  highContrast: Contrast;
  reducedMotion: boolean;
}

interface ThemeContextType {
  settings: AccessibilitySettings;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  setFontSize: (size: FontSize) => void;
  setHighContrast: (contrast: Contrast) => void;
  setReducedMotion: (reduced: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  settings: {
    theme: 'system',
    fontSize: 'medium',
    highContrast: 'normal',
    reducedMotion: false,
  },
  resolvedTheme: 'light',
  setTheme: () => {},
  setFontSize: () => {},
  setHighContrast: () => {},
  setReducedMotion: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    const stored = localStorage.getItem('uoftflow_accessibility');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // ignore
      }
    }
    return {
      theme: 'system',
      fontSize: 'medium',
      highContrast: 'normal',
      reducedMotion: false,
    };
  });

  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');
    const handler = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const resolvedTheme = settings.theme === 'system' ? systemTheme : settings.theme;

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(resolvedTheme);
    root.setAttribute('data-theme', resolvedTheme);

    // Font size
    root.classList.remove('font-small', 'font-medium', 'font-large');
    root.classList.add(`font-${settings.fontSize}`);

    // High contrast
    root.classList.remove('contrast-normal', 'contrast-high');
    root.classList.add(`contrast-${settings.highContrast}`);

    // Reduced motion
    if (settings.reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    localStorage.setItem('uoftflow_accessibility', JSON.stringify(settings));
  }, [settings, resolvedTheme]);

  const setTheme = (theme: Theme) => setSettings((s) => ({ ...s, theme }));
  const setFontSize = (fontSize: FontSize) => setSettings((s) => ({ ...s, fontSize }));
  const setHighContrast = (highContrast: Contrast) => setSettings((s) => ({ ...s, highContrast }));
  const setReducedMotion = (reducedMotion: boolean) => setSettings((s) => ({ ...s, reducedMotion }));

  return (
    <ThemeContext.Provider
      value={{
        settings,
        resolvedTheme,
        setTheme,
        setFontSize,
        setHighContrast,
        setReducedMotion,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
