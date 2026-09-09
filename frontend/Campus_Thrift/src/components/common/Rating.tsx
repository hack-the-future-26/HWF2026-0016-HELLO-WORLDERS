import React from 'react';
import { Star, ShieldCheck } from 'lucide-react';

interface RatingProps {
  rating: number;
  reviewCount?: number;
  verified?: boolean;
  size?: 'sm' | 'md';
}

export const Rating: React.FC<RatingProps> = ({
  rating,
  reviewCount,
  verified,
  size = 'sm'
}) => {
  const starSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <div className="flex items-center text-amber-500">
        <Star className={`${starSize} fill-amber-400 text-amber-400`} />
        <span className={`ml-1 font-semibold ${textSize} text-slate-800 dark:text-slate-200`}>
          {rating.toFixed(1)}
        </span>
      </div>

      {reviewCount !== undefined && (
        <span className={`${textSize} text-slate-500 dark:text-slate-400`}>
          ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
        </span>
      )}

      {verified && (
        <span className="inline-flex items-center gap-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
          <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          Verified Student
        </span>
      )}
    </div>
  );
};
