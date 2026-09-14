import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { api, BackendWishlistItem } from '../services/api';
import { productService } from '../services/productService';

const WL_MAP_KEY = 'ct_wl_map'; // productId → wishlistId

interface SavedProductsContextType {
  savedIds: string[];
  isSaved: (id: string) => boolean;
  toggleSave: (id: string) => Promise<boolean>;
  savedCount: number;
}

const Ctx = createContext<SavedProductsContextType | undefined>(undefined);

export const SavedProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [savedIds, setSavedIds] = useState<string[]>(() => productService.getSavedProductIds());
  const [wlMap, setWlMap] = useState<Record<string, number>>(() => {
    try { const s = localStorage.getItem(WL_MAP_KEY); return s ? JSON.parse(s) : {}; }
    catch { return {}; }
  });

  const persistMap = (m: Record<string, number>) => {
    setWlMap(m);
    try { localStorage.setItem(WL_MAP_KEY, JSON.stringify(m)); } catch { /* ignore */ }
  };

  const loadWishlist = useCallback(async () => {
    if (!user) return;
    try {
      const res = await api.get<{ success: boolean; wishlist: BackendWishlistItem[] }>(
        `/wishlist/${user.id}`
      );
      const items = res.wishlist ?? [];
      const ids = items.map(i => String(i.product_id));
      const map: Record<string, number> = {};
      items.forEach(i => { map[String(i.product_id)] = i.wishlist_id; });
      setSavedIds(ids);
      productService.syncSavedIds(ids);
      persistMap(map);
    } catch { /* offline — keep local state */ }
  }, [user]);

  useEffect(() => { loadWishlist(); }, [loadWishlist]);

  const isSaved = (id: string) => savedIds.includes(id);

  const toggleSave = async (id: string): Promise<boolean> => {
    if (!user) {
      const now = await productService.toggleSaveProduct(id);
      setSavedIds(productService.getSavedProductIds());
      return now;
    }
    if (isSaved(id)) {
      const wid = wlMap[id];
      if (wid) {
        try { await api.delete(`/wishlist/${wid}`); } catch { /* ignore */ }
        const m = { ...wlMap }; delete m[id]; persistMap(m);
      }
      const next = savedIds.filter(s => s !== id);
      setSavedIds(next); productService.syncSavedIds(next);
      return false;
    } else {
      try {
        const res = await api.post<{ success: boolean; wishlist?: { id: number } }>(
          '/wishlist', { user_id: Number(user.id), product_id: Number(id) }
        );
        if (res.wishlist) persistMap({ ...wlMap, [id]: res.wishlist.id });
      } catch { /* ignore */ }
      const next = [...savedIds, id];
      setSavedIds(next); productService.syncSavedIds(next);
      return true;
    }
  };

  return (
    <Ctx.Provider value={{ savedIds, isSaved, toggleSave, savedCount: savedIds.length }}>
      {children}
    </Ctx.Provider>
  );
};

export const useSavedProducts = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useSavedProducts must be used inside SavedProductsProvider');
  return ctx;
};
