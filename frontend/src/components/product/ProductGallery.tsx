import React, { useState } from 'react';

interface ProductGalleryProps {
  images: string[];
  title: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images, title }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const displayImages = images.length > 0 ? images : [
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800'
  ];

  return (
    <div className="space-y-3">
      {/* Main Large Image */}
      <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-sm relative">
        <img
          src={displayImages[selectedIndex]}
          alt={`${title} - view ${selectedIndex + 1}`}
          className="w-full h-full object-cover transition-all duration-300"
        />
      </div>

      {/* Thumbnails if more than 1 image */}
      {displayImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                selectedIndex === idx
                  ? 'border-emerald-600 ring-2 ring-emerald-500/20'
                  : 'border-slate-200 dark:border-slate-800 opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
