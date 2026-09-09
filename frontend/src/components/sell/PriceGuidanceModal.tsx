import React from 'react';
import { X, HelpCircle, TrendingUp, CheckCircle2 } from 'lucide-react';

interface PriceGuidanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSuggestedPrice?: (price: number) => void;
}

export const PriceGuidanceModal: React.FC<PriceGuidanceModalProps> = ({
  isOpen,
  onClose,
  onSelectSuggestedPrice
}) => {
  if (!isOpen) return null;

  const categories = [
    { name: 'STEM Textbooks', range: '$30 - $55', typicalDiscount: '65% - 75% off campus bookstore', example: 'Calculus, Bio 101, O-Chem' },
    { name: 'Graphing Calculators', range: '$45 - $65', typicalDiscount: '50% - 60% off retail', example: 'TI-84 Plus CE, TI-Nspire' },
    { name: 'Mini Fridges & Microwaves', range: '$50 - $85', typicalDiscount: '60% off retail', example: '3.2 cu. ft dorm refrigerators' },
    { name: 'Campus Commuter Bikes', range: '$90 - $160', typicalDiscount: '55% - 70% off retail', example: 'Trek, Giant, Specialized hybrids' },
    { name: 'Electronics & Monitors', range: '$40 - $90', typicalDiscount: '50% off retail', example: '24" 1080p screens, noise-canceling headphones' },
    { name: 'Lab Gear & Kits', range: '$15 - $25', typicalDiscount: '60% off bookstore kit', example: 'Lab coat + goggles, dissecting sets' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Campus-Thrift Price Guidance
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Typical student selling prices that sell within 48 hours
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
            >
              <div>
                <h4 className="text-xs font-semibold text-slate-900 dark:text-white">
                  {cat.name}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {cat.example} • {cat.typicalDiscount}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                  {cat.range}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
