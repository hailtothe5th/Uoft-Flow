import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function AccountChecker() {
  const [email, setEmail] = useState('');
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<any>(null);

  const checkAccount = async () => {
    setChecking(true);
    setResult(null);

    console.log('🔍 Checking account for:', email);

    try {
      // Try to reset password to see if account exists
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/update-password',
      });

      if (error) {
        console.error('❌ Account check error:', error);
        setResult({
          exists: false,
          message: 'Account does not exist or email is invalid',
          error: error.message,
        });
      } else {
        console.log('✅ Account exists - password reset email sent');
        setResult({
          exists: true,
          message: 'Account exists! A password reset email has been sent to your inbox.',
          info: 'Check your email (including spam folder) for the reset link',
        });
      }
    } catch (err: any) {
      console.error('❌ Unexpected error:', err);
      setResult({
        exists: false,
        message: 'Error checking account',
        error: err.message,
      });
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          🔍 Account Checker
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Check if your account exists and send a password reset email
        </p>

        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-uoft-blue focus:border-transparent dark:bg-slate-700 dark:text-white"
              placeholder="your@email.com"
            />
          </div>

          <button
            onClick={checkAccount}
            disabled={checking || !email}
            className="w-full bg-uoft-blue hover:bg-uoft-blue-light text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {checking ? 'Checking...' : 'Check Account & Send Reset Email'}
          </button>

          {result && (
            <div
              className={`p-4 rounded-lg border ${
                result.exists
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
              }`}
            >
              <div className="flex items-start gap-3">
                {result.exists ? (
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className={`font-semibold ${result.exists ? 'text-green-900 dark:text-green-100' : 'text-red-900 dark:text-red-100'}`}>
                    {result.message}
                  </p>
                  {result.info && (
                    <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                      {result.info}
                    </p>
                  )}
                  {result.error && (
                    <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                      Error: {result.error}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <div className="flex-1 text-sm text-blue-900 dark:text-blue-100">
                <p className="font-semibold mb-2">What this does:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Checks if an account exists with this email</li>
                  <li>Sends a password reset email if the account exists</li>
                  <li>Check your email inbox (and spam folder) for the reset link</li>
                  <li>Click the reset link to set a new password</li>
                  <li>Then you can login with your new password</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
