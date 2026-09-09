import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ShieldCheck, LogIn, GraduationCap, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthPage: React.FC = () => {
  const { registerOrLogin } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [college, setCollege] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  const clearErr = (key: string) =>
    setErrors(p => { const n = { ...p }; delete n[key]; return n; });

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Please enter your full name.';
    if (!email.trim()) {
      e.email = 'Please enter your university email.';
    } else if (!email.includes('@')) {
      e.email = 'Enter a valid email address.';
    } else if (!email.toLowerCase().includes('.edu')) {
      e.email = 'Only .edu university emails are accepted (e.g. name@iitd.edu).';
    }
    if (!college.trim()) e.college = 'Please enter your college / university.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await registerOrLogin(name.trim(), email.trim(), college.trim());
      navigate(redirectTarget);
    } catch (err) {
      setApiError(
        err instanceof Error
          ? err.message
          : 'Backend से connect नहीं हो पाया। क्या server चल रहा है?',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8 px-4 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>CampusThrift — Verified Student Access</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Sign In / Register
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          अपना <strong>.edu college email</strong> enter करें। Already registered हैं तो automatically login हो जाएगा।
        </p>
      </div>

      {/* Form card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
          <span>Student Details</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3" noValidate>
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => { setName(e.target.value); clearErr('name'); }}
              placeholder="जैसे: Arjun Sharma"
              autoComplete="name"
              className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                errors.name ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
              }`}
            />
            {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              University Email <span className="text-emerald-600 font-bold">(.edu required)</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); clearErr('email'); }}
              placeholder="yourname@iitd.edu"
              autoComplete="email"
              className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                errors.email ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
              }`}
            />
            {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
          </div>

          {/* College */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              College / University
            </label>
            <input
              type="text"
              value={college}
              onChange={e => { setCollege(e.target.value); clearErr('college'); }}
              placeholder="IIT Delhi, BITS Pilani, NIT Trichy…"
              autoComplete="organization"
              className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                errors.college ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
              }`}
            />
            {errors.college && <p className="text-xs text-rose-500 mt-1">{errors.college}</p>}
          </div>

          {apiError && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300">
              {apiError}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold text-sm shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <><Loader2 className="w-4 h-4 animate-spin" /><span>Signing in…</span></>
            ) : (
              <><LogIn className="w-4 h-4" /><span>Continue with Student ID</span></>
            )}
          </button>
        </form>

        <p className="text-[11px] text-slate-400 text-center leading-relaxed">
          Already registered? उसी .edu email से login करें — तुरंत access मिलेगा।
        </p>
      </div>
    </div>
  );
};
