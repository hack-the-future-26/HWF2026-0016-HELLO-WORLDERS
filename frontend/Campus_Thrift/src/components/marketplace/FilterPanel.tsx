import React from 'react';
import { RotateCcw, X } from 'lucide-react';
import { ProductCondition, ProductFilterState } from '../../types';

interface FilterPanelProps {
  filters: ProductFilterState;
  onFilterChange: (newFilters: Partial<ProductFilterState>) => void;
  onReset: () => void;
  onClose?: () => void;
  isMobile?: boolean;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange,
  onReset,
  onClose,
  isMobile = false,
}) => {
  const conditions: { id: ProductCondition | 'all'; label: string }[] = [
    { id: 'all', label: 'Any Condition' },
    { id: 'brand-new', label: 'Brand New' },
    { id: 'like-new', label: 'Like New' },
    { id: 'good', label: 'Good' },
    { id: 'fair', label: 'Fair' },
  ];

  const campusLocations = [
    'All Campus Areas',
    'Main Hostel Zone',
    'Central Library',
    'Academic Block',
    'Admin Block',
    'Canteen / Mess Area',
    'Sports Complex',
    'Girls Hostel',
    'Boys Hostel',
    'Main Gate',
  ];

  return (
    <div
      className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-6 ${
        isMobile ? 'max-h-[85vh] overflow-y-auto' : ''
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <h3 className="font-semibold text-sm text-slate-900 dark:text-white">Filter Listings</h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 md:hidden"
              aria-label="Close filters"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
          Price Range (₹)
        </label>
        <div className="grid grid-cols-2 gap-2">
          {(['minPrice', 'maxPrice'] as const).map((key, i) => (
            <div key={key} className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">₹</span>
              <input
                type="number"
                min="0"
                placeholder={i === 0 ? 'Min' : 'Max'}
                value={filters[key] ?? ''}
                onChange={(e) =>
                  onFilterChange({ [key]: e.target.value ? Number(e.target.value) : undefined })
                }
                className="w-full pl-6 pr-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Condition */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
          Item Condition
        </label>
        <div className="space-y-1.5">
          {conditions.map((cond) => (
            <label
              key={cond.id}
              className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 cursor-pointer hover:text-slate-900 dark:hover:text-white"
            >
              <input
                type="radio"
                name="condition"
                checked={(filters.condition || 'all') === cond.id}
                onChange={() => onFilterChange({ condition: cond.id })}
                className="w-3.5 h-3.5 text-emerald-600 focus:ring-emerald-500 border-slate-300 dark:border-slate-700 dark:bg-slate-800"
              />
              <span>{cond.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Campus Area */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
          Campus Pickup Area
        </label>
        <select
          value={filters.campus || ''}
          onChange={(e) => onFilterChange({ campus: e.target.value || undefined })}
          className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
        >
          {campusLocations.map((loc) => (
            <option key={loc} value={loc === 'All Campus Areas' ? '' : loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      {isMobile && onClose && (
        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow transition-colors"
        >
          Apply Filters
        </button>
      )}
    </div>
  );
};
