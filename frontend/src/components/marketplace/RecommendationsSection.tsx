import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Lightbulb } from 'lucide-react';
import { Recommendation } from '../../types';
import { recommendationService } from '../../services/recommendationService';
import { PriceTag } from '../common/PriceTag';
import { ConditionBadge } from '../common/ConditionBadge';

export const RecommendationsSection: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    recommendationService.getRecommendations().then((res) => {
      setRecommendations(res);
      setIsLoading(false);
    });
  }, []);

  if (isLoading || recommendations.length === 0) {
    return null;
  }

  return (
    <section className="my-8 pt-4 border-t border-slate-200/80 dark:border-slate-800/80">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Campus-Thrift AI Picks</span>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                Personalized
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Heuristic student recommendations tailored to your recent browsing & campus savings
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.slice(0, 3).map(({ product, reason }) => (
          <Link
            key={product.id}
            to={`/product/${product.id}`}
            className="group p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all hover:shadow-sm flex gap-3.5"
          >
            {/* Thumbnail */}
            <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 relative">
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                loading="lazy"
              />
              <div className="absolute top-1 left-1">
                <ConditionBadge condition={product.condition} className="text-[9px] px-1.5 py-0" />
              </div>
            </div>

            {/* Details & Reason */}
            <div className="flex-1 flex flex-col justify-between min-w-0">
              <div>
                <h4 className="text-xs font-semibold text-slate-900 dark:text-white line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {product.title}
                </h4>
                <div className="mt-1">
                  <PriceTag price={product.price} originalPrice={product.originalPrice} size="sm" />
                </div>
              </div>

              {/* Explainable recommendation reason */}
              <div className="mt-2 flex items-start gap-1 text-[11px] text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 p-1.5 rounded-lg border border-emerald-100 dark:border-emerald-900/60 leading-tight">
                <Lightbulb className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                <span className="truncate">{reason}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
