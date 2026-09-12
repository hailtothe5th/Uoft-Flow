import React from 'react';
import { AlertCircle, Database, ExternalLink } from 'lucide-react';

export default function SetupBanner() {
  return (
    <div className="bg-amber-50 border-l-4 border-amber-accent p-4 mb-6 rounded-r-xl">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-accent flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-bold text-uoft-blue mb-1">Database Setup Required</h3>
          <p className="text-sm text-gray-700 mb-2">
            The Supabase database tables haven't been created yet. The app is using local data as a fallback.
          </p>
          <div className="text-sm text-gray-600 space-y-1">
            <p className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              <span>Run the database schema to enable cloud sync</span>
            </p>
            <ol className="list-decimal list-inside ml-6 text-xs text-gray-500 space-y-0.5">
              <li>Go to your Supabase Dashboard → SQL Editor</li>
              <li>Copy the contents of <code className="bg-gray-100 px-1 rounded">supabase/schema.sql</code></li>
              <li>Paste and click "Run"</li>
            </ol>
          </div>
          <a
            href="https://supabase.com/dashboard/project/wzjvdwgocqzgdrxjvfir/sql"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-3 px-3 py-1.5 bg-uoft-blue text-white rounded-lg text-xs font-semibold hover:bg-uoft-blue-light transition-colors"
          >
            Open SQL Editor
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
