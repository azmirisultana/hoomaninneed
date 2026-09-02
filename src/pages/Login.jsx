import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Heart, LogIn, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user, login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || (user.role === 'admin' ? '/admin' : `/${user.role || 'donor'}`);
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      await loginWithGoogle();

    } catch (err) {
      console.error(err);
      setError('Failed to log in with Google.');
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);

    } catch (err) {
      console.error(err);
      setError('Invalid email or password.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-brand-cream">
      <div className="w-full max-w-md bg-brand-white rounded-2xl shadow-lg border border-brand-sage/50 p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-primary/10 rounded-full mb-4">
            <Heart className="w-8 h-8 text-brand-primary fill-brand-primary" />
          </div>
          <h2 className="text-2xl font-bold text-brand-charcoal">Welcome Back</h2>
          <p className="text-brand-muted mt-2">Sign in to your HoomanInNeed account</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-brand-red/10 border border-brand-red/20 text-brand-red rounded-lg text-sm text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-brand-charcoal mb-1.5" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-brand-sage focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all"
              placeholder="you@example.com"
              required
            />
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-brand-charcoal mb-1.5" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                autoComplete="new-password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-brand-sage focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all pr-12"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-primary transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <div className="text-right mt-2">
              <Link to="/forgot-password" className="text-xs text-brand-primary font-semibold hover:underline">
                Forgot password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-primary hover:bg-brand-primary-dark text-brand-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <LogIn className="w-5 h-5" />
            {isLoading ? 'Signing In...' : 'Sign In with Email'}
          </button>
        </form>

        <div className="mt-6 mb-6 flex items-center justify-center">
          <div className="border-t border-brand-sage w-full"></div>
          <span className="bg-brand-white px-3 text-sm text-brand-muted">OR</span>
          <div className="border-t border-brand-sage w-full"></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
          {isLoading ? 'Signing In...' : 'Sign in with Google'}
        </button>

        <div className="mt-6 text-center text-sm text-brand-muted">
          Don't have an account?{' '}
          <Link to="/register" className="text-brand-primary font-semibold hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
