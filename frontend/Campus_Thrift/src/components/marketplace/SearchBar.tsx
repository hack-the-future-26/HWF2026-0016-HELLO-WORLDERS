import React from 'react';
import { Search, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { ProductFilterState } from '../../types';

interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  sortBy: ProductFilterState['sortBy'];
  onSortChange: (sort: ProductFilterState['sortBy']) => void;
  onToggleFilters?: () => void;
  filterCount?: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  query,
  onQueryChange,
  sortBy,
  onSortChange,
  onToggleFilters,
  filterCount = 0
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full">
      {/* Search Input Box */}
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search textbooks, calculators, dorm fridges, bikes..."
          className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm"
        />
        {query && (
          <button
            type="button"
            onClick={() => onQueryChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Sort By Dropdown */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 sm:flex-none">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <ArrowUpDown className="w-3.5 h-3.5" />
          </div>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as ProductFilterState['sortBy'])}
            className="w-full sm:w-auto appearance-none pl-8 pr-8 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm cursor-pointer"
            aria-label="Sort products by"
          >
            <option value="newest">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="savings">Biggest Savings</option>
          </select>
        </div>

        {/* Filter Toggle Button */}
        {onToggleFilters && (
          <button
            type="button"
            onClick={onToggleFilters}
            className={`inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-colors shadow-sm ${
              filterCount > 0
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {filterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">
                {filterCount}
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
