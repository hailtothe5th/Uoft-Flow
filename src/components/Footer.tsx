import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Droplets } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-[var(--border-primary)] bg-[var(--bg-secondary)]">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-uoft-blue flex items-center justify-center">
              <Droplets className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-semibold text-[var(--text-primary)]">UofT Flow</p>
              <p className="text-xs text-[var(--text-secondary)]">Campus facilities finder</p>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm">
            <Link to="/terms" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              Terms
            </Link>
            <a
              href="https://ko-fi.com/uoftflow"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-boundless-blue text-white rounded-xl font-medium text-sm hover:bg-boundless-blue-light transition-all hover:scale-105"
            >
              <Heart className="w-4 h-4" />
              Support
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-6 border-t border-[var(--border-primary)] text-center">
          <p className="text-xs text-[var(--text-tertiary)]">
            Not affiliated with the University of Toronto. Made with 💩 and 💧 by students, for students.
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-2">
            © 2026 UofT Flow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
