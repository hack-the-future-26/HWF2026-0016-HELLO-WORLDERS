import React, { useState, useEffect, useMemo } from 'react';
import { Product, ProductFilterState, Category } from '../types';
import { productService } from '../services/productService';
import { SearchBar } from '../components/marketplace/SearchBar';
import { CategoryChips } from '../components/marketplace/CategoryChips';
import { FilterPanel } from '../components/marketplace/FilterPanel';
import { ProductGrid } from '../components/marketplace/ProductGrid';
import { RecommendationsSection } from '../components/marketplace/RecommendationsSection';
import { SafetyBanner } from '../components/common/SafetyBanner';

export const MarketplacePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [filters, setFilters] = useState<ProductFilterState>({
    query: '',
    category: 'all',
    condition: 'all',
    minPrice: undefined,
    maxPrice: undefined,
    campus: undefined,
    sortBy: 'newest'
  });

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const data = await productService.getProducts(filters);
      setProducts(data);
    } catch (err) {
      console.error('Failed to load marketplace products', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [filters]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.condition && filters.condition !== 'all') count++;
    if (filters.minPrice !== undefined && filters.minPrice > 0) count++;
    if (filters.maxPrice !== undefined && filters.maxPrice > 0) count++;
    if (filters.campus) count++;
    return count;
  }, [filters]);

  const handleQueryChange = (query: string) => {
    setFilters(prev => ({ ...prev, query }));
  };

  const handleCategoryChange = (category: Category) => {
    setFilters(prev => ({ ...prev, category }));
  };

  const handleFilterUpdate = (newFilters: Partial<ProductFilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      query: '',
      category: 'all',
      condition: 'all',
      minPrice: undefined,
      maxPrice: undefined,
      campus: undefined,
      sortBy: 'newest'
    });
    setShowMobileFilters(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Student Marketplace Intro */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold tracking-wide uppercase">
            Campus-Thrift Marketplace
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Buy & Sell Directly with Verified Students
          </h1>
          <p className="text-sm sm:text-base text-emerald-100 leading-relaxed">
            Save hundreds on textbooks, tech, lab equipment, and dorm essentials. Meet safely right on campus.
          </p>
        </div>

        {/* Subtle decorative campus geometry */}
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      </div>

      {/* Search & Sort Bar */}
      <SearchBar
        query={filters.query}
        onQueryChange={handleQueryChange}
        sortBy={filters.sortBy}
        onSortChange={(sortBy) => setFilters(prev => ({ ...prev, sortBy }))}
        onToggleFilters={() => setShowMobileFilters(!showMobileFilters)}
        filterCount={activeFilterCount}
      />

      {/* Category Pills */}
      <CategoryChips
        selectedCategory={filters.category}
        onSelectCategory={handleCategoryChange}
      />

      {/* Explainable AI Recommendations Section */}
      <RecommendationsSection />

      {/* Main Grid & Desktop Filter Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Desktop Sidebar Filter */}
        <div className="hidden lg:block lg:col-span-1 sticky top-20">
          <FilterPanel
            filters={filters}
            onFilterChange={handleFilterUpdate}
            onReset={handleResetFilters}
          />
        </div>

        {/* Product Grid Area */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>
              Showing <strong className="text-slate-900 dark:text-white">{products.length}</strong> items on Campus-Thrift
            </span>
            {filters.category !== 'all' && (
              <span className="capitalize font-semibold text-emerald-600 dark:text-emerald-400">
                Filtered by {filters.category.replace('-', ' ')}
              </span>
            )}
          </div>

          <ProductGrid
            products={products}
            isLoading={isLoading}
            onResetFilters={handleResetFilters}
          />
        </div>
      </div>

      {/* Mobile Filter Sheet Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden flex items-end justify-center bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl p-4 shadow-2xl">
            <FilterPanel
              filters={filters}
              onFilterChange={handleFilterUpdate}
              onReset={handleResetFilters}
              onClose={() => setShowMobileFilters(false)}
              isMobile={true}
            />
          </div>
        </div>
      )}

      {/* Safety Banner */}
      <SafetyBanner />
    </div>
  );
};
