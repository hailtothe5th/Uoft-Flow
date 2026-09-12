import React from 'react';
import { useData } from '../context/DataContext';
import { Database, HardDrive, CheckCircle, AlertCircle } from 'lucide-react';

export default function DatabaseStatus() {
  const { supabaseConnected, isLoading, facilities, reviews } = useData();

  if (isLoading) {
    return (
      <div className="fixed bottom-4 right-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 px-4 py-3 z-50">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-uoft-blue border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-slate-600 dark:text-slate-300">Connecting to database...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 px-4 py-3 z-50 max-w-xs">
      {supabaseConnected ? (
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <CheckCircle className="w-5 h-5 text-success" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Database className="w-4 h-4 text-uoft-blue" />
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                Connected to Supabase
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {facilities.length} facilities • {reviews.length} reviews
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-warning" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <HardDrive className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                Using Local Storage
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
              Supabase not connected. Data saved locally only.
            </p>
            <details className="text-xs">
              <summary className="cursor-pointer text-boundless-blue hover:underline font-medium">
                How to connect
              </summary>
              <div className="mt-2 text-slate-600 dark:text-slate-400 space-y-1">
                <p>1. Run <code className="bg-slate-100 dark:bg-slate-700 px-1 rounded">supabase/schema.sql</code> in Supabase SQL Editor</p>
                <p>2. Refresh this page</p>
              </div>
            </details>
          </div>
        </div>
      )}
    </div>
  );
}
