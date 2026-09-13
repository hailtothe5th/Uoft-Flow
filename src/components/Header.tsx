import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Droplets, Home, PlusCircle, User, LogOut, Heart, MessageSquare, MapPin, Sun, Moon, Monitor, Accessibility, Key } from 'lucide-react';
import AccessibilityControls from './AccessibilityControls';

export default function Header() {
  const { user, signOut, isAuthenticated } = useAuth();
  const { settings, resolvedTheme, setTheme } = useTheme();
  const location = useLocation();
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const cycleTheme = () => {
    const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(settings.theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  return (
    <header className="header-enhanced sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl overflow-hidden group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <img src="/icon.svg" alt="UofT Flow" className="w-full h-full" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight leading-none text-uoft-blue dark:text-white">
                UofT Flow
              </h1>
              <p className="text-xs text-uoft-gray dark:text-slate-400 font-medium mt-0.5">
                Campus facilities finder
              </p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-3">
            <Link
              to="/"
              className={`nav-link flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                isActive('/') 
                  ? 'bg-uoft-blue dark:bg-slate-800 text-white shadow-md' 
                  : 'text-uoft-blue dark:text-slate-300 hover:bg-uoft-blue/10 dark:hover:bg-slate-800'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="hidden sm:inline">Find</span>
            </Link>
            
            <Link
              to="/contribute"
              className={`nav-link flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                isActive('/contribute') 
                  ? 'bg-uoft-blue dark:bg-slate-800 text-white shadow-md' 
                  : 'text-uoft-blue dark:text-slate-300 hover:bg-uoft-blue/10 dark:hover:bg-slate-800'
              }`}
            >
              <PlusCircle className="w-5 h-5" />
              <span className="hidden sm:inline">Contribute</span>
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-uoft-blue-light/50 dark:hover:bg-slate-800 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">{user?.displayName}</span>
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-1 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-blue-100 dark:border-slate-700 overflow-hidden min-w-[180px] z-50">
                    <Link
                      to="/change-password"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-uoft-blue dark:text-white hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      <Key className="w-4 h-4" />
                      Change Password
                    </Link>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        signOut();
                      }}
                      className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-uoft-blue dark:text-white hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors w-full text-left border-t border-blue-50 dark:border-slate-700"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive('/login') ? 'bg-uoft-blue-light dark:bg-slate-800 text-amber-accent' : 'hover:bg-uoft-blue-light/50 dark:hover:bg-slate-800'
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
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-boundless-blue text-white hover:bg-boundless-blue-light transition-all hover:scale-105"
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
