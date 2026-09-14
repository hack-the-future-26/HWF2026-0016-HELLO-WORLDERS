import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ShieldCheck, LogIn, UserPlus, GraduationCap, Loader2, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthPage: React.FC = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/';

  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [college, setCollege] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (mode === 'register') {
      if (!name.trim()) newErrors.name = 'Please enter your full name.';
      if (!college.trim()) newErrors.college = 'Please enter your college / university name.';
    }

    if (!email.trim()) {
      newErrors.email = 'Please enter your email address.';
    } else if (!email.includes('@')) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      newErrors.password = 'Please enter your password.';
    } else if (mode === 'register' && password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      if (mode === 'signin') {
        await login(email.trim(), password);
      } else {
        await register(name.trim(), email.trim(), password, college.trim());
      }
      navigate(redirectTarget);
    } catch (err) {
      setApiError(
        err instanceof Error
          ? err.message
          : 'Could not connect to Campus-Thrift. Please verify the backend is running.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = (newMode: 'signin' | 'register') => {
    setMode(newMode);
    setErrors({});
    setApiError('');
  };

  return (
    <div className="max-w-md mx-auto py-8 px-4 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>Campus-Thrift Student Access</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {mode === 'signin' ? 'Sign In to Campus-Thrift' : 'Create an Account'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          {mode === 'signin'
            ? 'Sign in with your email and password to manage your listings and chats.'
            : 'Join the campus community to buy, sell, borrow, and lend items.'}
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
        {/* Mode Toggle Tabs */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => switchMode('signin')}
            className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              mode === 'signin'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => switchMode('register')}
            className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              mode === 'register'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Register</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3" noValidate>
          {/* Name (Register only) */}
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrors((p) => { const n = { ...p }; delete n.name; return n; });
                }}
                placeholder="Priyanka Sharma"
                autoComplete="name"
                className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  errors.name ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                }`}
              />
              {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((p) => { const n = { ...p }; delete n.email; return n; });
              }}
              placeholder="yourname@college.edu"
              autoComplete="email"
              className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                errors.email ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
              }`}
            />
            {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((p) => { const n = { ...p }; delete n.password; return n; });
              }}
              placeholder="••••••••"
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                errors.password ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
              }`}
            />
            {errors.password && <p className="text-xs text-rose-500 mt-1">{errors.password}</p>}
          </div>

          {/* College (Register only) */}
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                College / University
              </label>
              <input
                type="text"
                value={college}
                onChange={(e) => {
                  setCollege(e.target.value);
                  setErrors((p) => { const n = { ...p }; delete n.college; return n; });
                }}
                placeholder="IIT Delhi, BITS Pilani, …"
                autoComplete="organization"
                className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  errors.college ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                }`}
              />
              {errors.college && <p className="text-xs text-rose-500 mt-1">{errors.college}</p>}
            </div>
          )}

          {/* API-level error banner */}
          {apiError && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300">
              {apiError}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold text-sm shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{mode === 'signin' ? 'Signing in…' : 'Creating account…'}</span>
              </>
            ) : mode === 'signin' ? (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In with Password</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Register Student Account</span>
              </>
            )}
          </button>
        </form>

        {/* Bottom helper text */}
        <div className="text-center pt-2">
          {mode === 'signin' ? (
            <button
              type="button"
              onClick={() => switchMode('register')}
              className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Don't have an account yet? Register here
            </button>
          ) : (
            <button
              type="button"
              onClick={() => switchMode('signin')}
              className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Already registered? Sign in with password
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
