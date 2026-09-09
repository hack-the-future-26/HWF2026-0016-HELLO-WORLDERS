import React, { createContext, useContext, useState, useEffect } from 'react';
import { productService } from '../services/productService';

interface SavedProductsContextType {
  savedIds: string[];
  isSaved: (id: string) => boolean;
  toggleSave: (id: string) => Promise<boolean>;
  savedCount: number;
}

const SavedProductsContext = createContext<SavedProductsContextType | undefined>(undefined);

export const SavedProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedIds, setSavedIds] = useState<string[]>(() => productService.getSavedProductIds());

  useEffect(() => {
    setSavedIds(productService.getSavedProductIds());
  }, []);

  const isSaved = (id: string) => savedIds.includes(id);

  const toggleSave = async (id: string): Promise<boolean> => {
    const isNowSaved = await productService.toggleSaveProduct(id);
    setSavedIds(productService.getSavedProductIds());
    return isNowSaved;
  };

  return (
    <SavedProductsContext.Provider
      value={{
        savedIds,
        isSaved,
        toggleSave,
        savedCount: savedIds.length
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
