import React from 'react';
import { ProductCondition } from '../../types';

interface ConditionBadgeProps {
  condition: ProductCondition;
  className?: string;
}

export const ConditionBadge: React.FC<ConditionBadgeProps> = ({ condition, className = '' }) => {
  const getBadgeConfig = () => {
    switch (condition) {
      case 'brand-new':
        return {
          label: 'Brand New',
          classes: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
        };
      case 'like-new':
        return {
          label: 'Like New',
          classes: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-400 dark:border-teal-800'
        };
      case 'good':
        return {
          label: 'Good',
          classes: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800'
        };
      case 'fair':
        return {
          label: 'Fair',
          classes: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800'
        };
      default:
        return {
          label: condition,
          classes: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
        };
    }
  };

  const config = getBadgeConfig();

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.classes} ${className}`}
    >
      {config.label}
    </span>
  );
};
