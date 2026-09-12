import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Droplets } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-uoft-blue-dark dark:bg-slate-950 text-white mt-12 border-t border-slate-800">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-amber-accent" />
            <span className="font-bold text-sm">UofT Flow</span>
            <span className="text-xs text-blue-300 dark:text-slate-400">— Campus facilities finder</span>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <Link to="/terms" className="text-blue-200 dark:text-slate-300 hover:text-white transition-colors">
              Terms of Service
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

        <div className="mt-6 pt-4 border-t border-blue-800 dark:border-slate-800 text-center">
          <p className="text-xs text-blue-300 dark:text-slate-400">
            Not affiliated with the University of Toronto. Made with 💩 and 💧 by students, for students.
          </p>
          <p className="text-xs text-blue-400 dark:text-slate-500 mt-1">
            © 2026 UofT Flow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
