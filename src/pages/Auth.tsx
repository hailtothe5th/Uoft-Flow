import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Droplets, ArrowLeft, Mail } from 'lucide-react';

export default function Auth() {
  const navigate = useNavigate();
  const { signIn, isAuthenticated } = useAuth();

  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  if (isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-4xl mb-3">✅</p>
        <p className="text-xl font-bold text-uoft-blue dark:text-white mb-2">You're signed in!</p>
        <p className="text-gray-500 dark:text-slate-400 mb-6">You can now submit reviews and add locations</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-uoft-blue dark:bg-slate-700 text-white rounded-xl font-bold hover:bg-uoft-blue-light dark:hover:bg-slate-600 transition-colors"
        >
          Browse Facilities
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !displayName.trim()) {
      setError('Please fill in all fields');
      return;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await signIn(email.trim(), displayName.trim());
      if (email.includes('@')) {
        setMagicLinkSent(true);
      } else {
        navigate('/');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (magicLinkSent) {
    return (
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 card-shadow border border-blue-100 dark:border-slate-700 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-100 dark:bg-green-900/30 mb-4">
            <Mail className="w-8 h-8 text-green-600 dark:text-green-300" />
          </div>
          <h2 className="text-xl font-black text-uoft-blue dark:text-white mb-2">Check your email!</h2>
          <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">
            We've sent a magic link to <strong>{email}</strong>. Click the link to verify your account.
          </p>
          <p className="text-xs text-gray-400 dark:text-slate-500 mb-6">
            You can also continue browsing the app while you wait.
          </p>
          <div className="flex flex-col gap-2">
            <Link
              to="/"
              className="px-6 py-3 bg-uoft-blue dark:bg-slate-700 text-white rounded-xl font-bold hover:bg-uoft-blue-light dark:hover:bg-slate-600 transition-colors"
            >
              Continue to App
            </Link>
            <button
              onClick={() => setMagicLinkSent(false)}
              className="px-6 py-2 text-sm text-gray-500 dark:text-slate-400 hover:text-uoft-blue dark:hover:text-white transition-colors"
            >
              ← Back to sign in
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-gray-500 dark:text-slate-400 hover:text-uoft-blue dark:hover:text-white font-semibold mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 card-shadow border border-blue-100 dark:border-slate-700">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-uoft-blue dark:bg-slate-700 mb-3">
            <Droplets className="w-8 h-8 text-amber-accent" />
          </div>
          <h1 className="text-2xl font-black text-uoft-blue dark:text-white">Hey there! 👋</h1>
          <p className="text-sm text-gray-600 dark:text-slate-300 mt-2">
            Sign in to share your campus experiences and help fellow students find the best facilities.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-uoft-blue dark:text-white mb-1">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your campus name"
              className="w-full px-4 py-3 rounded-xl border border-blue-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-accent/50 focus:border-amber-accent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-uoft-blue dark:text-white mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              placeholder="you@mail.utoronto.ca"
              className="w-full px-4 py-3 rounded-xl border border-blue-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-accent/50 focus:border-amber-accent"
              required
            />
          </div>

          {error && (
            <p className="text-sm text-bad-red font-semibold bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-amber-accent text-uoft-blue-dark rounded-xl font-bold text-lg hover:bg-amber-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-uoft-blue-dark border-t-transparent rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <p className="text-xs text-gray-400 dark:text-slate-500 text-center mt-4">
          By signing in, you agree to our{' '}
          <Link to="/terms" className="text-uoft-blue dark:text-amber-accent hover:underline">
            Terms of Service
          </Link>
        </p>

        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-slate-700">
          <p className="text-xs text-gray-400 dark:text-slate-500 text-center">
            🔓 Browsing is open to everyone — sign in only needed to contribute
          </p>
        </div>
      </div>
    </div>
  );
}
