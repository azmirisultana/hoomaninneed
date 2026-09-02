import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Key } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      await resetPassword(email);
      setMessage('Check your inbox for further instructions.');
    } catch (err) {
      console.error(err);
      setError('Failed to reset password. Please verify your email.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-brand-cream">
      <div className="w-full max-w-md bg-brand-white rounded-2xl shadow-lg border border-brand-sage/50 p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-primary/10 rounded-full mb-4">
            <Key className="w-8 h-8 text-brand-primary fill-brand-primary" />
          </div>
          <h2 className="text-2xl font-bold text-brand-charcoal">Password Reset</h2>
          <p className="text-brand-muted mt-2">Enter your email and we'll send you a link</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-brand-red/10 border border-brand-red/20 text-brand-red rounded-lg text-sm text-center font-medium">
            {error}
          </div>
        )}
        {message && (
          <div className="mb-6 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm text-center font-medium">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-brand-charcoal mb-1.5" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-brand-sage focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all"
              placeholder="you@example.com"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-primary hover:bg-brand-primary-dark text-brand-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-brand-muted">
          <Link to="/login" className="text-brand-primary font-semibold hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
