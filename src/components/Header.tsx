import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Droplets, Home, PlusCircle, User, LogOut, Heart, MessageSquare, MapPin, Sun, Moon, Monitor, Accessibility } from 'lucide-react';
import AccessibilityControls from './AccessibilityControls';

export default function Header() {
  const { user, signOut, isAuthenticated } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const location = useLocation();
  const [showAddMenu, setShowAddMenu] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const cycleTheme = () => {
    const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(resolvedTheme as 'light' | 'dark' | 'system');
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  return (
    <header className="bg-uoft-blue dark:bg-slate-900 text-white sticky top-0 z-50 shadow-lg border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <Droplets className="w-7 h-7 text-amber-accent" />
            <div>
              <h1 className="text-xl font-black tracking-tight leading-none">UofT Flow</h1>
              <p className="text-xs text-blue-200 dark:text-slate-400 font-medium">Campus facilities finder</p>
            </div>
          </Link>

          <nav className="flex items-center gap-1">
            <Link
              to="/"
              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/') ? 'bg-uoft-blue-light dark:bg-slate-800 text-amber-accent' : 'hover:bg-uoft-blue-light/50 dark:hover:bg-slate-800'
              }`}
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Find</span>
            </Link>
            <div className="relative">
              <button
                onClick={() => setShowAddMenu(!showAddMenu)}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive('/submit') || isActive('/add') ? 'bg-uoft-blue-light dark:bg-slate-800 text-amber-accent' : 'hover:bg-uoft-blue-light/50 dark:hover:bg-slate-800'
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Add</span>
              </button>
              {showAddMenu && (
                <div className="absolute right-0 top-full mt-1 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-blue-100 dark:border-slate-700 overflow-hidden min-w-[180px] z-50">
                  <Link
                    to="/submit"
                    onClick={() => setShowAddMenu(false)}
                    className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-uoft-blue dark:text-white hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Write a Review
                  </Link>
                  <Link
                    to="/add"
                    onClick={() => setShowAddMenu(false)}
                    className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-uoft-blue dark:text-white hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors border-t border-blue-50 dark:border-slate-700"
                  >
                    <MapPin className="w-4 h-4" />
                    Add a Location
                  </Link>
                </div>
              )}
            </div>
            {isAuthenticated ? (
              <button
                onClick={signOut}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-uoft-blue-light/50 dark:hover:bg-slate-800 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">{user?.displayName}</span>
              </button>
            ) : (
              <Link
                to="/auth"
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive('/auth') ? 'bg-uoft-blue-light dark:bg-slate-800 text-amber-accent' : 'hover:bg-uoft-blue-light/50 dark:hover:bg-slate-800'
                }`}
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Sign In</span>
              </Link>
            )}
            
            {/* Theme toggle */}
            <button
              onClick={cycleTheme}
              className="p-2 rounded-lg hover:bg-uoft-blue-light/50 dark:hover:bg-slate-800 transition-colors"
              aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Current: ${resolvedTheme} mode`}
            >
              {resolvedTheme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Accessibility controls */}
            <AccessibilityControls />

            <a
              href="https://ko-fi.com/uoftflow"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold bg-amber-accent text-uoft-blue-dark hover:bg-amber-light transition-colors"
            >
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">Support</span>
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
