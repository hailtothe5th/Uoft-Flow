import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Droplets, ArrowLeft } from 'lucide-react';

export default function Auth() {
  const navigate = useNavigate();
  const { signIn, isAuthenticated } = useAuth();

  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');

  if (isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-4xl mb-3">✅</p>
        <p className="text-xl font-bold text-uoft-blue mb-2">You're signed in!</p>
        <p className="text-gray-500 mb-6">You can now submit reviews and add locations</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-uoft-blue text-white rounded-xl font-bold hover:bg-uoft-blue-light transition-colors"
        >
          Browse Facilities
        </Link>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !displayName.trim()) {
      setError('Please fill in all fields');
      return;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }
    signIn(email.trim(), displayName.trim());
    navigate('/');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-uoft-blue font-semibold mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="bg-white rounded-2xl p-8 card-shadow border border-blue-100">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-uoft-blue mb-3">
            <Droplets className="w-8 h-8 text-amber-accent" />
          </div>
          <h1 className="text-2xl font-black text-uoft-blue">Welcome to UofT Flow</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to contribute reviews and locations</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-uoft-blue mb-1">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your campus name"
              className="w-full px-4 py-3 rounded-xl border border-blue-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-accent/50 focus:border-amber-accent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-uoft-blue mb-1">
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
              className="w-full px-4 py-3 rounded-xl border border-blue-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-accent/50 focus:border-amber-accent"
              required
            />
          </div>

          {error && (
            <p className="text-sm text-bad-red font-semibold bg-red-50 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-amber-accent text-uoft-blue-dark rounded-xl font-bold text-lg hover:bg-amber-light transition-colors"
          >
            Sign In
          </button>
        </form>

        <p className="text-xs text-gray-400 text-center mt-4">
          By signing in, you agree to our{' '}
          <Link to="/terms" className="text-uoft-blue hover:underline">
            Terms of Service
          </Link>
        </p>

        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center">
            🔓 Browsing is open to everyone — sign in only needed to contribute
          </p>
        </div>
      </div>
    </div>
  );
}
