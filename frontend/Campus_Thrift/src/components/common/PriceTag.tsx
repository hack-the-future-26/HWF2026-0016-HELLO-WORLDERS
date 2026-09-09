import React from 'react';

interface PriceTagProps {
  price: number;
  originalPrice?: number;
  size?: 'sm' | 'md' | 'lg';
  showSavings?: boolean;
}

export const PriceTag: React.FC<PriceTagProps> = ({
  price,
  originalPrice,
  size = 'md',
  showSavings = true
}) => {
  const savings = originalPrice && originalPrice > price ? originalPrice - price : 0;
  const savingsPct = originalPrice && originalPrice > price ? Math.round((savings / originalPrice) * 100) : 0;

  const sizeClasses = {
    sm: {
      price: 'text-base font-bold',
      original: 'text-xs',
      badge: 'text-[10px] px-1.5 py-0.5'
    },
    md: {
      price: 'text-xl font-bold',
      original: 'text-sm',
      badge: 'text-xs px-2 py-0.5'
    },
    lg: {
      price: 'text-3xl font-extrabold',
      original: 'text-base',
      badge: 'text-xs px-2.5 py-1'
    }
  }[size];

  return (
    <div className="flex items-baseline gap-2 flex-wrap">
      <span className={`${sizeClasses.price} text-slate-900 dark:text-white tracking-tight`}>
        ${price}
      </span>
      {originalPrice && originalPrice > price && (
        <>
          <span className={`${sizeClasses.original} text-slate-400 dark:text-slate-500 line-through`}>
            ${originalPrice}
          </span>
          {showSavings && savingsPct > 0 && (
            <span className={`${sizeClasses.badge} rounded-md font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300`}>
              Save {savingsPct}%
            </span>
          )}
        </>
      )}
    </div>
  );
};
