import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, ShoppingBag, CheckCircle, ExternalLink, Tag } from 'lucide-react';
import { Product } from '../types';
import { productService } from '../services/productService';
import { useAuth } from '../context/AuthContext';
import { PriceTag } from '../components/common/PriceTag';
import { ConditionBadge } from '../components/common/ConditionBadge';
import { EmptyState } from '../components/common/EmptyState';
import { ConfirmDialog } from '../components/common/ConfirmDialog';

export const MyListingsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [listings, setListings] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'sold'>('all');
  const [selectedProductForSold, setSelectedProductForSold] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadListings = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await productService.getMyListings(user.id);
      setListings(data);
    } catch (e) {
      console.error('Failed to load listings', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadListings();
  }, [user]);

  const handleMarkAsSold = async () => {
    if (!selectedProductForSold) return;
    await productService.updateProductStatus(selectedProductForSold.id, 'sold');
    setSelectedProductForSold(null);
    loadListings();
  };

  if (!user) return null;

  const filteredListings = listings.filter((item) => {
    if (activeTab === 'active') return item.status === 'active';
    if (activeTab === 'sold') return item.status === 'sold';
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            My Campus-Thrift Listings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Manage your active items and track products you have sold to classmates.
          </p>
        </div>

        <Link
          to="/sell"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-colors self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>List Another Item</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        {(['all', 'active', 'sold'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-colors ${
              activeTab === tab
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {tab} ({listings.filter((l) => (tab === 'all' ? true : l.status === tab)).length})
          </button>
        ))}
      </div>

      {/* Listings List */}
      {filteredListings.length === 0 ? (
        <EmptyState
          icon={<ShoppingBag className="w-8 h-8" />}
          title="No Listings Found"
          description={
            activeTab === 'sold'
              ? 'You haven’t marked any items as sold yet.'
              : 'You don’t have any listings yet. Post a textbook, calculator, or dorm gear to get started!'
          }
          actionText="Sell an Item"
          onAction={() => navigate('/sell')}
        />
      ) : (
        <div className="space-y-4">
          {filteredListings.map((product) => (
            <div
              key={product.id}
              className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4 min-w-0 flex-1">
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover bg-slate-100 dark:bg-slate-800 shrink-0"
                />
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        product.status === 'active'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {product.status}
                    </span>
                    <ConditionBadge condition={product.condition} className="text-[10px]" />
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                    {product.title}
                  </h3>

                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <PriceTag price={product.price} originalPrice={product.originalPrice} size="sm" />
                    <span>•</span>
                    <span>Pickup: {product.pickupLocation}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <Link
                  to={`/product/${product.id}`}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View</span>
                </Link>

                {product.status === 'active' && (
                  <button
                    type="button"
                    onClick={() => setSelectedProductForSold(product)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Mark as Sold</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!selectedProductForSold}
        onClose={() => setSelectedProductForSold(null)}
        onConfirm={handleMarkAsSold}
        title="Mark Item as Sold?"
        description={`Are you sure you want to mark "${selectedProductForSold?.title}" as sold? It will be updated across the Campus-Thrift marketplace.`}
        confirmText="Yes, Mark Sold"
      />
    </div>
  );
};
