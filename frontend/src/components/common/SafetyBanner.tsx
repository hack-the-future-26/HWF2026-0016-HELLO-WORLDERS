import React from 'react';
import { Shield, MapPin, Eye, CheckCircle2 } from 'lucide-react';

interface SafetyBannerProps {
  compact?: boolean;
}

export const SafetyBanner: React.FC<SafetyBannerProps> = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/70 dark:bg-emerald-950/20 p-3.5 flex items-start gap-3 text-xs text-emerald-900 dark:text-emerald-300">
        <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-emerald-950 dark:text-emerald-200">Campus Safety Reminder: </span>
          Meet in public campus safe zones (Student Union, Campus Library, or Dining Commons). Always inspect items before completing payment.
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 dark:from-emerald-950/30 dark:via-slate-900 dark:to-emerald-950/30 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-lg bg-emerald-600 text-white">
          <Shield className="w-5 h-5" />
        </div>
        <h3 className="font-semibold text-slate-900 dark:text-white text-base">
          Campus-Thrift Student Safe Exchange Guide
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-700 dark:text-slate-300">
        <div className="flex items-start gap-2 bg-white/70 dark:bg-slate-800/60 p-3 rounded-xl border border-emerald-100 dark:border-slate-700">
          <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-900 dark:text-white block">Official Safe Zones</span>
            Meet at the Student Union, Science Library lobby, or Campus Police safe exchange spots.
          </div>
        </div>

        <div className="flex items-start gap-2 bg-white/70 dark:bg-slate-800/60 p-3 rounded-xl border border-emerald-100 dark:border-slate-700">
          <Eye className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-900 dark:text-white block">Inspect First</span>
            Power on electronics, flip textbook pages, or test bike brakes before finalizing payment.
          </div>
        </div>

        <div className="flex items-start gap-2 bg-white/70 dark:bg-slate-800/60 p-3 rounded-xl border border-emerald-100 dark:border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-900 dark:text-white block">No Advance Wire/Cards</span>
            Never send prepaid gift cards or advance wire deposits to hold any item.
          </div>
        </div>
      </div>
    </div>
  );
};
