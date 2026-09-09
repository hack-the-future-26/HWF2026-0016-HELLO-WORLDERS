import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, MapPin, CheckCircle2 } from 'lucide-react';
import { Product } from '../../types';
import { PriceTag } from '../common/PriceTag';
import { ConditionBadge } from '../common/ConditionBadge';
import { useSavedProducts } from '../../context/SavedProductsContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { isSaved, toggleSave } = useSavedProducts();
  const saved = isSaved(product.id);

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSave(product.id);
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:border-emerald-400 dark:hover:border-emerald-600 transition-all hover:shadow-md flex flex-col relative"
    >
      {/* Image container */}
      <div className="relative aspect-[4/3] bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600'}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Sold overlay */}
        {product.status === 'sold' && (
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-[2px] flex items-center justify-center">
            <span className="px-3 py-1 bg-rose-600 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow">
              Sold
            </span>
          </div>
        )}

        {/* Condition Badge top-left */}
        <div className="absolute top-2.5 left-2.5">
          <ConditionBadge condition={product.condition} />
        </div>

        {/* Save button top-right */}
        <button
          type="button"
          onClick={handleSaveClick}
          aria-label={saved ? 'Remove from saved' : 'Save item'}
          className={`absolute top-2.5 right-2.5 p-2 rounded-xl backdrop-blur-md transition-colors shadow-sm ${
            saved
              ? 'bg-emerald-600 text-white'
              : 'bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-900'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${saved ? 'fill-white' : ''}`} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Title */}
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {product.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-xs mt-1.5">
            <MapPin className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="truncate">{product.pickupLocation || product.campus}</span>
          </div>
        </div>

        {/* Bottom bar: Price & Seller */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <PriceTag price={product.price} originalPrice={product.originalPrice} size="sm" />

          {product.seller && (
            <div className="flex items-center gap-1.5" title={product.seller.name}>
              <img
                src={product.seller.avatar}
                alt={product.seller.name}
                className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
              />
              <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium truncate max-w-[80px]">
                {product.seller.name.split(' ')[0]}
              </span>
              {product.seller.verifiedStudent && (
                <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};
