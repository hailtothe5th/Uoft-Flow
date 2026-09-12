import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Droplets } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-uoft-blue-dark text-white mt-12">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-amber-accent" />
            <span className="font-bold text-sm">UofT Flow</span>
            <span className="text-xs text-blue-300">— Campus facilities finder</span>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <Link to="/terms" className="text-blue-200 hover:text-white transition-colors">
              Terms of Service
            </Link>
            <a
              href="https://ko-fi.com/uoftflow"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-1.5 bg-amber-accent text-uoft-blue-dark rounded-lg font-bold text-xs hover:bg-amber-light transition-colors"
            >
              <Heart className="w-3 h-3" />
              Support us on Ko-fi
            </a>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-blue-800 text-center">
          <p className="text-xs text-blue-300">
            Not affiliated with the University of Toronto. Made with 💩 and 💧 by students, for students.
          </p>
          <p className="text-xs text-blue-400 mt-1">
            © 2026 UofT Flow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
