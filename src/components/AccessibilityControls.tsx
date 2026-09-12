import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Monitor, Type, Eye, Accessibility } from 'lucide-react';

export default function AccessibilityControls() {
  const { settings, resolvedTheme, setTheme, setFontSize, setHighContrast, setReducedMotion } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2.5 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] transition-all"
        aria-label="Accessibility settings"
        aria-expanded={isOpen}
      >
        <Accessibility className="w-5 h-5" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div 
            className="absolute right-0 top-full mt-2 w-80 glass rounded-2xl shadow-[var(--shadow-lg)] border border-[var(--border-primary)] p-6 z-50 slide-in"
            role="dialog"
            aria-label="Accessibility settings"
          >
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <Accessibility className="w-5 h-5 text-boundless-blue" />
              Accessibility
            </h2>

            {/* Theme */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Theme
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setTheme('light')}
                  className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all ${
                    settings.theme === 'light'
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                      : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                  }`}
                  aria-pressed={settings.theme === 'light'}
                >
                  <Sun className="w-5 h-5" />
                  <span className="text-xs font-medium">Light</span>
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all ${
                    settings.theme === 'dark'
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                      : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                  }`}
                  aria-pressed={settings.theme === 'dark'}
                >
                  <Moon className="w-5 h-5" />
                  <span className="text-xs font-medium">Dark</span>
                </button>
                <button
                  onClick={() => setTheme('system')}
                  className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all ${
                    settings.theme === 'system'
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                      : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                  }`}
                  aria-pressed={settings.theme === 'system'}
                >
                  <Monitor className="w-5 h-5" />
                  <span className="text-xs font-medium">System</span>
                </button>
              </div>
            </div>

            {/* Font Size */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Font Size
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setFontSize('small')}
                  className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all ${
                    settings.fontSize === 'small'
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                      : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                  }`}
                  aria-pressed={settings.fontSize === 'small'}
                >
                  <Type className="w-4 h-4" />
                  <span className="text-xs font-medium">Small</span>
                </button>
                <button
                  onClick={() => setFontSize('medium')}
                  className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all ${
                    settings.fontSize === 'medium'
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                      : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                  }`}
                  aria-pressed={settings.fontSize === 'medium'}
                >
                  <Type className="w-5 h-5" />
                  <span className="text-xs font-medium">Medium</span>
                </button>
                <button
                  onClick={() => setFontSize('large')}
                  className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all ${
                    settings.fontSize === 'large'
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                      : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                  }`}
                  aria-pressed={settings.fontSize === 'large'}
                >
                  <Type className="w-6 h-6" />
                  <span className="text-xs font-medium">Large</span>
                </button>
              </div>
            </div>

            {/* High Contrast */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Contrast
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setHighContrast('normal')}
                  className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all ${
                    settings.highContrast === 'normal'
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                      : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                  }`}
                  aria-pressed={settings.highContrast === 'normal'}
                >
                  <Eye className="w-5 h-5" />
                  <span className="text-xs font-medium">Normal</span>
                </button>
                <button
                  onClick={() => setHighContrast('high')}
                  className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all ${
                    settings.highContrast === 'high'
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                      : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                  }`}
                  aria-pressed={settings.highContrast === 'high'}
                >
                  <Eye className="w-5 h-5" />
                  <span className="text-xs font-medium">High</span>
                </button>
              </div>
            </div>

            {/* Reduced Motion */}
            <div className="mb-4">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Reduce Motion
                </span>
                <input
                  type="checkbox"
                  checked={settings.reducedMotion}
                  onChange={(e) => setReducedMotion(e.target.checked)}
                  className="w-5 h-5 rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                  aria-checked={settings.reducedMotion}
                />
              </label>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Current: {resolvedTheme === 'dark' ? 'Dark' : 'Light'} mode
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
