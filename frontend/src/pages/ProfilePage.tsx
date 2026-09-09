import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  MapPin, 
  GraduationCap, 
  Star, 
  Bookmark, 
  ShoppingBag, 
  LogOut, 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSavedProducts } from '../context/SavedProductsContext';
import { Product } from '../types';
import { productService } from '../services/productService';
import { ProductCard } from '../components/marketplace/ProductCard';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { EmptyState } from '../components/common/EmptyState';

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const { savedIds } = useSavedProducts();
  const navigate = useNavigate();

  const [savedProducts, setSavedProducts] = useState<Product[]>([]);
  const [myListingsCount, setMyListingsCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setIsLoading(true);
    Promise.all([
      productService.getSavedProducts(),
      productService.getMyListings(user.id)
    ]).then(([saved, my]) => {
      setSavedProducts(saved);
      setMyListingsCount(my.length);
      setIsLoading(false);
    });
  }, [user, savedIds]);

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Profile Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-6">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover ring-4 ring-emerald-500/20"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  {user.name}
                </h1>
                {user.verifiedStudent && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Student
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-slate-400" />
                {user.department} • {user.graduationYear}
              </p>

              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                {user.dorm} • {user.campus}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex sm:flex-col items-center sm:items-end gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Campus Rating</span>
            <div className="flex items-center gap-1 mt-0.5">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-base font-bold text-slate-900 dark:text-white">{user.rating.toFixed(1)}</span>
              <span className="text-xs text-slate-400">({user.reviewCount})</span>
            </div>
          </div>

          <Link to="/my-listings" className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">My Listings</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <ShoppingBag className="w-4 h-4 text-emerald-600" />
              <span className="text-base font-bold text-slate-900 dark:text-white">{myListingsCount}</span>
            </div>
          </Link>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Saved Items</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Bookmark className="w-4 h-4 text-blue-600" />
              <span className="text-base font-bold text-slate-900 dark:text-white">{savedProducts.length}</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Theme Setting</span>
            <div className="mt-1">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Saved Bookmarked Products Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-emerald-600" />
            <span>Saved Marketplace Items</span>
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {savedProducts.length} {savedProducts.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        {savedProducts.length === 0 ? (
          <EmptyState
            icon={<Bookmark className="w-7 h-7" />}
            title="No Saved Items Yet"
            description="When browsing the Campus-Thrift marketplace, click the bookmark icon on any item to save it here for quick access."
            actionText="Explore Marketplace"
            onAction={() => navigate('/')}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {savedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
