import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Bookmark, 
  MessageSquare, 
  MapPin, 
  ShieldCheck, 
  Share2, 
  Eye,
  Check
} from 'lucide-react';
import { Product } from '../types';
import { productService } from '../services/productService';
import { chatService } from '../services/chatService';
import { useAuth } from '../context/AuthContext';
import { useSavedProducts } from '../context/SavedProductsContext';
import { ProductGallery } from '../components/product/ProductGallery';
import { SellerCard } from '../components/product/SellerCard';
import { ProductSafetyAdvisory } from '../components/product/ProductSafetyAdvisory';
import { PriceTag } from '../components/common/PriceTag';
import { ConditionBadge } from '../components/common/ConditionBadge';
import { ProductDetailSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { isSaved, toggleSave } = useSavedProducts();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isStartingChat, setIsStartingChat] = useState(false);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    productService.getProductById(id).then((p) => {
      setProduct(p);
      setIsLoading(false);
    });
  }, [id]);

  const handleChatClick = async () => {
    if (!product) return;

    // Hard requirement: If unauthenticated, redirect to auth page with return redirect
    if (!isAuthenticated || !user) {
      navigate(`/auth?redirect=${encodeURIComponent(`/product/${product.id}`)}`);
      return;
    }

    // Don't chat with self
    if (user.id === product.sellerId) {
      navigate('/my-listings');
      return;
    }

    setIsStartingChat(true);
    try {
      const convId = await chatService.getOrCreateConversation(product.id, user.id, product.sellerId);
      navigate(`/chat/${convId}`);
    } catch (e) {
      console.error('Failed to initiate chat', e);
      setIsStartingChat(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        <ProductDetailSkeleton />
      </div>
    );
  }

  if (!product) {
    return (
      <EmptyState
        title="Product Not Found"
        description="This listing may have been removed or marked as sold by the seller on Campus-Thrift."
        actionText="Back to Marketplace"
        onAction={() => navigate('/')}
      />
    );
  }

  const saved = isSaved(product.id);
  const isOwner = user?.id === product.sellerId;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Top Breadcrumb & Share */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </Link>

        <button
          type="button"
          onClick={handleCopyLink}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
          <span>{copiedLink ? 'Link Copied!' : 'Share Listing'}</span>
        </button>
      </div>

      {/* Main Grid: Gallery on left, Info & Actions on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 space-y-6">
          <ProductGallery images={product.images} title={product.title} />

          {/* Description Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Item Details & Description
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-1.5">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Advisory Safety Box */}
          <ProductSafetyAdvisory product={product} />
        </div>

        {/* Right Column: Title, Price, Actions, Seller */}
        <div className="lg:col-span-5 space-y-6 sticky top-20">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            {/* Condition & Category */}
            <div className="flex items-center justify-between">
              <ConditionBadge condition={product.condition} />
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 capitalize">
                {product.category.replace('-', ' ')}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {product.title}
            </h1>

            {/* Price */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <PriceTag price={product.price} originalPrice={product.originalPrice} size="lg" />
            </div>

            {/* Pickup location indicator */}
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60 flex items-start gap-2.5 text-xs text-emerald-900 dark:text-emerald-300">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-emerald-950 dark:text-emerald-200">Campus Pickup Location:</strong>
                {product.pickupLocation}
              </div>
            </div>

            {/* Actions: Chat with Seller & Save */}
            <div className="space-y-2 pt-2">
              {isOwner ? (
                <Link
                  to="/my-listings"
                  className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  Manage Your Listing
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={handleChatClick}
                  disabled={isStartingChat || product.status === 'sold'}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm shadow-emerald-600/20 transition-all hover:shadow"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>
                    {product.status === 'sold'
                      ? 'Item Sold'
                      : isStartingChat
                      ? 'Connecting...'
                      : isAuthenticated
                      ? 'Chat with Seller'
                      : 'Sign In to Chat with Seller'}
                  </span>
                </button>
              )}

              <button
                type="button"
                onClick={() => toggleSave(product.id)}
                className={`w-full py-2.5 px-4 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
                  saved
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800'
                    : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${saved ? 'fill-emerald-600 text-emerald-600' : ''}`} />
                <span>{saved ? 'Saved in Bookmarks' : 'Save to Favorites'}</span>
              </button>
            </div>
          </div>

          {/* Seller Profile Card */}
          {product.seller && <SellerCard seller={product.seller} />}
        </div>
      </div>
    </div>
  );
};
