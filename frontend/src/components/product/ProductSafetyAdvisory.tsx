import React from 'react';
import { ShieldCheck, MapPin, AlertCircle } from 'lucide-react';
import { Product } from '../../types';
import { scamService } from '../../services/scamService';
import { ScamWarning } from '../common/ScamWarning';

interface ProductSafetyAdvisoryProps {
  product: Product;
}

export const ProductSafetyAdvisory: React.FC<ProductSafetyAdvisoryProps> = ({ product }) => {
  const analysis = scamService.analyzeListing(
    product.title,
    product.description,
    product.price,
    product.category
  );

  return (
    <div className="space-y-3">
      {/* If any heuristic flags detected, show advisory warning */}
      {analysis.hasWarning && <ScamWarning analysis={analysis} />}

      {/* Standard student safe exchange card */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Campus Safe Exchange Tips</span>
        </div>

        <div className="space-y-1.5 pl-6 list-disc">
          <div>
            <strong>Campus Safe Zone:</strong> Meet at {product.pickupLocation || 'the Student Union Lobby or Science Library'}.
          </div>
          <div>
            <strong>Physical Inspection:</strong> Verify the item condition and functionality in person before paying.
          </div>
          <div>
            <strong>Campus-Thrift Policy:</strong> No advance wire transfers or gift cards. Cash or local peer payment upon handoff is safest.
          </div>
        </div>
      </div>
    </div>
  );
};
