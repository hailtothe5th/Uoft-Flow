import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Droplets, Home, PlusCircle, User, LogOut, Heart, MessageSquare, MapPin, Sun, Moon, Key } from 'lucide-react';
import AccessibilityControls from './AccessibilityControls';

export default function Header() {
  const { user, signOut, isAuthenticated } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const location = useLocation();
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const cycleTheme = () => {
    const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(resolvedTheme as 'light' | 'dark' | 'system');
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  return (
    <header className="glass sticky top-0 z-50 border-b border-[var(--border-primary)]">
      <div className="max-w-5xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl overflow-hidden group-hover:scale-105 transition-transform">
              <img src="/icon.svg" alt="UofT Flow" className="w-full h-full" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-[var(--text-primary)]">UofT Flow</h1>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-2">
            <Link
              to="/"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive('/')
                  ? 'bg-uoft-blue text-white'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Find</span>
            </Link>
            
            <div className="relative">
              <button
                onClick={() => setShowAddMenu(!showAddMenu)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  isActive('/submit') || isActive('/add')
                    ? 'bg-uoft-blue text-white'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Add</span>
              </button>
              {showAddMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowAddMenu(false)} />
                  <div className="absolute right-0 top-full mt-2 glass rounded-2xl shadow-[var(--shadow-lg)] border border-[var(--border-primary)] overflow-hidden min-w-[200px] z-50 fade-in">
                    <Link
                      to="/submit"
                      onClick={() => setShowAddMenu(false)}
                      className="flex items-center gap-3 px-5 py-4 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
                    >
                      <MessageSquare className="w-4 h-4 text-boundless-blue" />
                      Write a Review
                    </Link>
                    <Link
                      to="/add"
                      onClick={() => setShowAddMenu(false)}
                      className="flex items-center gap-3 px-5 py-4 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors border-t border-[var(--border-primary)]"
                    >
                      <MapPin className="w-4 h-4 text-boundless-blue" />
                      Add a Location
                    </Link>
                  </div>
                </>
              )}
            </div>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-boundless-blue flex items-center justify-center">
                    <span className="text-xs font-semibold text-white">{user?.displayName?.charAt(0).toUpperCase()}</span>
                  </div>
                  <span className="hidden sm:inline">{user?.displayName}</span>
                </button>
                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                    <div className="absolute right-0 top-full mt-2 glass rounded-2xl shadow-[var(--shadow-lg)] border border-[var(--border-primary)] overflow-hidden min-w-[200px] z-50 fade-in">
                      <Link
                        to="/change-password"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-5 py-4 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
                      >
                        <Key className="w-4 h-4 text-boundless-blue" />
                        Change Password
                      </Link>
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          signOut();
                        }}
                        className="flex items-center gap-3 px-5 py-4 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors w-full text-left border-t border-[var(--border-primary)]"
                      >
                        <LogOut className="w-4 h-4 text-error" />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-uoft-blue text-white hover:bg-uoft-blue-light transition-all hover:scale-105"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Sign In</span>
              </Link>
            )}
            
            {/* Theme toggle */}
            <button
              onClick={cycleTheme}
              className="p-2.5 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] transition-all"
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
