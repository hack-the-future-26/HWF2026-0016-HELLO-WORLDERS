import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto py-16 text-center space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto">
        <ShoppingBag className="w-8 h-8" />
      </div>

      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
        Page Not Found
      </h1>

      <p className="text-sm text-slate-500 dark:text-slate-400">
        The Campus-Thrift page you were looking for doesn't exist or has moved.
      </p>

      <button
        type="button"
        onClick={() => navigate('/')}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Marketplace</span>
      </button>
    </div>
  );
};
