import React from 'react';
import { 
  BookOpen, 
  Laptop, 
  Home, 
  Armchair, 
  Bike, 
  FlaskConical, 
  Shirt, 
  Sparkles,
  LayoutGrid
} from 'lucide-react';
import { Category } from '../../types';

interface CategoryChipsProps {
  selectedCategory: Category;
  onSelectCategory: (category: Category) => void;
}

export const CategoryChips: React.FC<CategoryChipsProps> = ({
  selectedCategory,
  onSelectCategory
}) => {
  const categories: { id: Category; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All Items', icon: <LayoutGrid className="w-4 h-4" /> },
    { id: 'textbooks', label: 'Textbooks', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'electronics', label: 'Electronics', icon: <Laptop className="w-4 h-4" /> },
    { id: 'dorm-essentials', label: 'Dorm Essentials', icon: <Home className="w-4 h-4" /> },
    { id: 'furniture', label: 'Furniture', icon: <Armchair className="w-4 h-4" /> },
    { id: 'bicycles', label: 'Bicycles & Transit', icon: <Bike className="w-4 h-4" /> },
    { id: 'lab-equipment', label: 'Lab & STEM', icon: <FlaskConical className="w-4 h-4" /> },
    { id: 'clothing', label: 'Clothing & Gear', icon: <Shirt className="w-4 h-4" /> },
    { id: 'other', label: 'Other', icon: <Sparkles className="w-4 h-4" /> },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none py-1">
      {categories.map((cat) => {
        const isSelected = selectedCategory === cat.id;
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.id)}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
              isSelected
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {cat.icon}
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
};
