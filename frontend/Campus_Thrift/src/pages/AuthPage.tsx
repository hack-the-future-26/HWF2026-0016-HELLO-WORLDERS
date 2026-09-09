import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ShieldCheck, Sparkles, LogIn, GraduationCap, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthPage: React.FC = () => {
  const { demoUsers, loginAs, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/';

  const [customEmail, setCustomEmail] = useState('');
  const [error, setError] = useState('');

  const handleSelectUser = (userId: string) => {
    loginAs(userId);
    navigate(redirectTarget);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.trim()) {
      setError('Please enter your university email');
      return;
    }

    if (!customEmail.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    // Assign to Alex Rivera default profile for custom email demo
    loginAs('user-alex');
    navigate(redirectTarget);
  };

  return (
    <div className="max-w-xl mx-auto py-8 px-4 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>Campus-Thrift Student Access</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Sign In to Campus-Thrift
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          Connect directly with verified students on campus. Select a demo student account below for instant hackathon access.
        </p>
      </div>

      {/* Demo Student Account Quick-Picker */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Select Demo Student Account</span>
          </h2>
          <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded font-semibold">
            One-Click Login
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {demoUsers.map((u) => {
            const isCurrent = user?.id === u.id;
            return (
              <button
                key={u.id}
                type="button"
                onClick={() => handleSelectUser(u.id)}
                className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all hover:scale-[1.02] ${
                  isCurrent
                    ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'
                }`}
              >
                <img
                  src={u.avatar}
                  alt={u.name}
                  className="w-10 h-10 rounded-xl object-cover ring-1 ring-emerald-500/30"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {u.name}
                    </p>
                    {isCurrent && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {u.department}
                  </p>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium truncate block">
                    {u.dorm.split(' ')[0]}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Or University Email Form */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Or Sign In with University Email (.edu)
        </h2>

        <form onSubmit={handleCustomSubmit} className="space-y-3">
          <div>
            <input
              type="email"
              value={customEmail}
              onChange={(e) => {
                setCustomEmail(e.target.value);
                setError('');
              }}
              placeholder="yourname@university.edu"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Continue with Student ID</span>
          </button>
        </form>

        <p className="text-[11px] text-slate-400 text-center leading-relaxed">
          Demo Mode: All student authentication is handled locally in your browser. Real campus SSO and OAuth integration will be connected by backend teammates.
        </p>
      </div>
    </div>
  );
};
