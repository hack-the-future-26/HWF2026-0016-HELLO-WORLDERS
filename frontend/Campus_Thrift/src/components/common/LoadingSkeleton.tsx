import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-slate-200 dark:bg-slate-800" />
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-center">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
        </div>
        <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/5" />
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/5" />
        </div>
      </div>
    </div>
  );
};

export const ProductDetailSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-pulse">
      <div className="lg:col-span-7 space-y-4">
        <div className="aspect-[4/3] bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        <div className="flex gap-3">
          <div className="w-20 h-20 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="w-20 h-20 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        </div>
      </div>
      <div className="lg:col-span-5 space-y-5">
        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
        <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        <div className="h-36 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
      </div>
    </div>
  );
};

export const ChatSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 animate-pulse p-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800" />
        <div className="space-y-1.5 flex-1">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
        </div>
      </div>
      <div className="space-y-3 pt-6">
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-2xl w-2/3 mr-auto" />
        <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-2xl w-1/2 ml-auto" />
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-2xl w-3/5 mr-auto" />
      </div>
    </div>
  );
};
