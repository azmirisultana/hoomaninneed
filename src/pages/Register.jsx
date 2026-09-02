import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState('donor');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { user, register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  // Prevent auto-redirect during active registration
  useEffect(() => {
    if (user && !isLoading) {
      navigate(`/${user.role || 'donor'}`, { replace: true });
    }
  }, [user, navigate, isLoading]);

  const handleGoogleSignup = async () => {
    setError('');
    setIsLoading(true);

    try {
      // Pass the selected role so we can save it to the database for this new user
      await loginWithGoogle(role);
      navigate(`/${role}`, { replace: true });
    } catch (err) {
      console.error(err);
      setError('Failed to sign up with Google.');
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      // Real Firebase Registration
      await register(email, password, name, role);
      navigate(`/${role}`, { replace: true });
    } catch (err) {
      console.error(err);
      setError(
        err.message || 'Failed to create an account. Please try again.'
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-brand-cream">
      <div className="w-full max-w-lg bg-brand-white rounded-2xl shadow-lg border border-brand-sage/50 p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-brand-charcoal">
            Create an Account
          </h2>
          <p className="text-brand-muted mt-2">
            Join NoWaste Network to help rescue food
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-brand-red/10 border border-brand-red/20 text-brand-red rounded-lg text-sm text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selection */}
          <div>
            <label
              className="block text-sm font-medium text-brand-charcoal mb-1.5"
              htmlFor="role"
            >
              I want to join as a...
            </label>

            <select
              id="role"
              value={role || 'donor'}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-brand-sage focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all bg-brand-white"
              required
            >
              <option value="donor">
                Food Donor (Restaurant/Cafe)
              </option>
              <option value="volunteer">
                Volunteer (Transport)
              </option>
              <option value="organization">
                Animal Welfare Organization
              </option>
            </select>
          </div>

          {/* Name */}
          <div>
            <label
              className="block text-sm font-medium text-brand-charcoal mb-1.5"
              htmlFor="name"
            >
              Full Name / Organization Name
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-brand-sage focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all"
              placeholder="Enter your name"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label
              className="block text-sm font-medium text-brand-charcoal mb-1.5"
              htmlFor="email"
            >
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Password */}
            <div>
              <label
                className="block text-sm font-medium text-brand-charcoal mb-1.5"
                htmlFor="password"
              >
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
                  minLength={6}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-primary transition-colors"
                  aria-label={
                    showPassword ? 'Hide password' : 'Show password'
                  }
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                className="block text-sm font-medium text-brand-charcoal mb-1.5"
                htmlFor="confirmPassword"
              >
                Confirm Password
              </label>

              <div className="relative">
                <input
                  id="confirmPassword"
                  type={
                    showConfirmPassword ? 'text' : 'password'
                  }
                  value={confirmPassword}
                  autoComplete="new-password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-brand-sage focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all pr-12"
                  placeholder="••••••••"
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-primary transition-colors"
                  aria-label={
                    showConfirmPassword
                      ? 'Hide confirm password'
                      : 'Show confirm password'
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-amber hover:bg-brand-amber/90 text-brand-charcoal font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 mt-6 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <UserPlus className="w-5 h-5" />
            {isLoading
              ? 'Creating Account...'
              : 'Create Account with Email'}
          </button>
        </form>

        <div className="mt-6 mb-6 flex items-center justify-center">
          <div className="border-t border-brand-sage w-full"></div>
          <span className="bg-brand-white px-3 text-sm text-brand-muted">
            OR
          </span>
          <div className="border-t border-brand-sage w-full"></div>
        </div>

        <button
          onClick={handleGoogleSignup}
          disabled={isLoading}
          className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="w-5 h-5"
          />

          {isLoading ? 'Creating Account...' : 'Sign up with Google'}
        </button>

        <div className="mt-6 text-center text-sm text-brand-muted">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-brand-primary font-semibold hover:underline"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}