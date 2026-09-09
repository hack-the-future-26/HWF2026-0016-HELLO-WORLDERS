import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { api, BackendWishlistItem } from '../services/api';
import { productService } from '../services/productService';

const WISHLIST_ID_MAP_KEY = 'campus_thrift_wishlist_id_map'; // productId → wishlistId

interface SavedProductsContextType {
  savedIds: string[];
  isSaved: (id: string) => boolean;
  toggleSave: (id: string) => Promise<boolean>;
  savedCount: number;
}

const SavedProductsContext = createContext<SavedProductsContextType | undefined>(undefined);

export const SavedProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [savedIds, setSavedIds] = useState<string[]>(() => productService.getSavedProductIds());
  // maps productId (string) → wishlistId (number) for DELETE requests
  const [wishlistIdMap, setWishlistIdMap] = useState<Record<string, number>>(() => {
    try {
      const s = localStorage.getItem(WISHLIST_ID_MAP_KEY);
      return s ? JSON.parse(s) : {};
    } catch {
      return {};
    }
  });

  const persistMap = (map: Record<string, number>) => {
    setWishlistIdMap(map);
    try {
      localStorage.setItem(WISHLIST_ID_MAP_KEY, JSON.stringify(map));
    } catch {
      /* ignore */
    }
  };

  // -----------------------------------------------------------------------
  // On login: load wishlist from backend and sync local state
  // -----------------------------------------------------------------------
  const loadWishlist = useCallback(async () => {
    if (!user) return;
    try {
      const res = await api.get<{ success: boolean; wishlist: BackendWishlistItem[] }>(
        `/wishlist/${user.id}`,
      );
      const items = res.wishlist ?? [];
      const ids = items.map((item) => String(item.product_id));
      const map: Record<string, number> = {};
      items.forEach((item) => {
        map[String(item.product_id)] = item.wishlist_id;
      });
      setSavedIds(ids);
      productService.syncSavedIds(ids);
      persistMap(map);
    } catch (e) {
      console.error('Failed to load wishlist from backend', e);
    }
  }, [user]);

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  // -----------------------------------------------------------------------
  // Toggle save — add/remove via backend wishlist endpoints
  // -----------------------------------------------------------------------
  const isSaved = (id: string) => savedIds.includes(id);

  const toggleSave = async (id: string): Promise<boolean> => {
    if (!user) {
      // Not logged in: fall back to local only
      const isNowSaved = await productService.toggleSaveProduct(id);
      setSavedIds(productService.getSavedProductIds());
      return isNowSaved;
    }

    if (isSaved(id)) {
      // Remove from wishlist
      const wishlistId = wishlistIdMap[id];
      if (wishlistId) {
        try {
          await api.delete(`/wishlist/${wishlistId}`);
        } catch (e) {
          console.error('Failed to remove from wishlist', e);
        }
        const newMap = { ...wishlistIdMap };
        delete newMap[id];
        persistMap(newMap);
      }
      const newIds = savedIds.filter((s) => s !== id);
      setSavedIds(newIds);
      productService.syncSavedIds(newIds);
      return false;
    } else {
      // Add to wishlist
      try {
        const res = await api.post<{
          success: boolean;
          wishlist?: { id: number; user_id: number; product_id: number };
        }>('/wishlist', {
          user_id: Number(user.id),
          product_id: Number(id),
        });
        if (res.wishlist) {
          const newMap = { ...wishlistIdMap, [id]: res.wishlist.id };
          persistMap(newMap);
        }
      } catch (e) {
        console.error('Failed to add to wishlist', e);
      }
      const newIds = [...savedIds, id];
      setSavedIds(newIds);
      productService.syncSavedIds(newIds);
      return true;
    }
  };

  return (
    <SavedProductsContext.Provider
      value={{
        savedIds,
        isSaved,
        toggleSave,
        savedCount: savedIds.length,
      }}
    >
      {children}
    </SavedProductsContext.Provider>
  );
};

export const useSavedProducts = () => {
  const context = useContext(SavedProductsContext);
  if (!context) {
    throw new Error('useSavedProducts must be used within a SavedProductsProvider');
  }
  return context;
};
