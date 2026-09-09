import React from 'react';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { ScamAnalysisResult } from '../../types';

interface ScamWarningProps {
  analysis: ScamAnalysisResult;
  className?: string;
}

export const ScamWarning: React.FC<ScamWarningProps> = ({ analysis, className = '' }) => {
  if (!analysis.hasWarning || analysis.signals.length === 0) {
    return null;
  }

  const getSeverityStyle = () => {
    switch (analysis.maxSeverity) {
      case 'danger':
        return {
          container: 'bg-rose-50 border-rose-200 text-rose-900 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-200',
          icon: <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />,
          title: 'Advisory Warning: High-Risk Signals Detected'
        };
      case 'warning':
        return {
          container: 'bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-200',
          icon: <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />,
          title: 'Advisory Notice: Caution Recommended'
        };
      case 'info':
      default:
        return {
          container: 'bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-200',
          icon: <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />,
          title: 'Advisory Tip: Safety Check'
        };
    }
  };

  const style = getSeverityStyle();

  return (
    <div className={`p-4 rounded-xl border ${style.container} text-xs space-y-2 ${className}`}>
      <div className="flex items-center gap-2 font-semibold">
        {style.icon}
        <span className="text-sm">{style.title}</span>
      </div>

      <p className="font-medium text-slate-800 dark:text-slate-200">
        Safety check: verify this information before completing a transaction. Campus-Thrift recommends meeting on campus in daylight.
      </p>

      <ul className="space-y-1.5 pl-5 list-disc">
        {analysis.signals.map((sig, idx) => (
          <li key={idx} className="leading-relaxed">
            <strong className="text-slate-900 dark:text-white">{sig.title}:</strong> {sig.description}
            <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 italic">
              ↳ {sig.advice}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
