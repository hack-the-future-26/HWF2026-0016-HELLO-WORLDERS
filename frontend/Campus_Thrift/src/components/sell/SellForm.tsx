import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  HelpCircle, 
  Sparkles, 
  MapPin, 
  CheckCircle2, 
  Image as ImageIcon,
  AlertCircle
} from 'lucide-react';
import { Category, ProductCondition } from '../../types';
import { productService } from '../../services/productService';
import { scamService } from '../../services/scamService';
import { useAuth } from '../../context/AuthContext';
import { PriceGuidanceModal } from './PriceGuidanceModal';
import { ScamWarning } from '../common/ScamWarning';
import { ConfirmDialog } from '../common/ConfirmDialog';

const PRESET_IMAGES = [
  { label: 'Textbook', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800' },
  { label: 'Calculator', url: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&q=80&w=800' },
  { label: 'Headphones', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800' },
  { label: 'Desk Lamp', url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800' },
  { label: 'Bicycle', url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&q=80&w=800' },
  { label: 'Backpack', url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800' },
];

export const SellForm: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Exclude<Category, 'all'>>('textbooks');
  const [price, setPrice] = useState<number | ''>('');
  const [originalPrice, setOriginalPrice] = useState<number | ''>('');
  const [condition, setCondition] = useState<ProductCondition>('good');
  const [description, setDescription] = useState('');
  const [pickupLocation, setPickupLocation] = useState('Science Library Lobby (Safe Zone)');
  const [tagsInput, setTagsInput] = useState('');
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0].url);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPriceGuide, setShowPriceGuide] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Advisory scam analysis on the fly
  const scamAnalysis = scamService.analyzeListing(
    title,
    description,
    typeof price === 'number' ? price : 0,
    category
  );

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Listing title is required.';
    } else if (title.trim().length < 5) {
      newErrors.title = 'Title should be at least 5 characters.';
    }

    if (price === '' || price <= 0) {
      newErrors.price = 'Please enter a valid price greater than $0.';
    }

    if (originalPrice !== '' && typeof price === 'number' && originalPrice < price) {
      newErrors.originalPrice = 'Original retail price cannot be less than your selling price.';
    }

    if (!description.trim()) {
      newErrors.description = 'Please describe your item and its condition.';
    } else if (description.trim().length < 15) {
      newErrors.description = 'Description must be at least 15 characters.';
    }

    if (!pickupLocation.trim()) {
      newErrors.pickupLocation = 'Campus pickup spot is required.';
    }

    if (!imageUrl.trim()) {
      newErrors.imageUrl = 'At least one product image is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setShowConfirm(true);
    }
  };

  const handleConfirmedPublish = async () => {
    if (!user) return;
    setIsSubmitting(true);

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);

    if (tags.length === 0) {
      tags.push(category);
    }

    try {
      const created = await productService.createProduct({
        title: title.trim(),
        category,
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : Number(price) * 1.5,
        condition,
        description: description.trim(),
        pickupLocation: pickupLocation.trim(),
        campus: user.campus || 'Main University Campus',
        sellerId: user.id,
        images: [imageUrl.trim()],
        tags
      });

      navigate(`/product/${created.id}`);
    } catch (err) {
      console.error('Failed to create product', err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          List an Item on Campus-Thrift
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Turn unneeded textbooks, tech, and dorm supplies into cash for other students.
        </p>
      </div>

      {/* Advisory Warning Banner if triggered */}
      {scamAnalysis.hasWarning && <ScamWarning analysis={scamAnalysis} />}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Listing Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Stewart Calculus 9th Edition or TI-84 Plus CE"
            className={`w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
              errors.title ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
            }`}
          />
          {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title}</p>}
        </div>

        {/* Category & Condition Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Exclude<Category, 'all'>)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="textbooks">Textbooks & Course Notes</option>
              <option value="electronics">Electronics & Tech</option>
              <option value="dorm-essentials">Dorm & Hostel Essentials</option>
              <option value="furniture">Furniture & Desks</option>
              <option value="bicycles">Bicycles, Scooters & Transit</option>
              <option value="lab-equipment">Lab Equipment & STEM Kits</option>
              <option value="clothing">Campus Apparel & Bags</option>
              <option value="other">Other Campus Gear</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Condition *
            </label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value as ProductCondition)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="brand-new">Brand New (Unused / Sealed)</option>
              <option value="like-new">Like New (Mint / Barely used)</option>
              <option value="good">Good (Normal wear, fully functional)</option>
              <option value="fair">Fair (Visible cosmetic wear, works fine)</option>
            </select>
          </div>
        </div>

        {/* Pricing Grid with Price Guidance Button */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Pricing *
            </label>
            <button
              type="button"
              onClick={() => setShowPriceGuide(true)}
              className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Campus Price Guidance</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-bold">$</span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={price}
                  onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : '')}
                  placeholder="Selling Price"
                  className={`w-full pl-8 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    errors.price ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                  }`}
                />
              </div>
              {errors.price && <p className="text-xs text-rose-500 mt-1">{errors.price}</p>}
            </div>

            <div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-bold">$</span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value ? Number(e.target.value) : '')}
                  placeholder="Original Retail Price (Optional)"
                  className="w-full pl-8 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Helps show students how much they save</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Description *
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Include course codes if applicable (e.g. MATH 21A), warranty status, included cables/accessories, or reason for selling."
            className={`w-full p-3.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
              errors.description ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
            }`}
          />
          {errors.description && <p className="text-xs text-rose-500 mt-1">{errors.description}</p>}
        </div>

        {/* Product Image Selection / Preset */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Product Photo *
          </label>

          {/* Quick preset selector for instant testing */}
          <div className="mb-3">
            <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1.5">
              Quick presets for fast demo listing:
            </span>
            <div className="flex flex-wrap gap-2">
              {PRESET_IMAGES.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setImageUrl(preset.url)}
                  className={`px-3 py-1 text-xs rounded-lg border transition-all ${
                    imageUrl === preset.url
                      ? 'bg-emerald-600 text-white border-emerald-600 font-semibold'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Or paste image URL (https://...)"
              className="flex-1 px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {imageUrl && (
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
          {errors.imageUrl && <p className="text-xs text-rose-500 mt-1">{errors.imageUrl}</p>}
        </div>

        {/* Campus Pickup Spot */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Safe Campus Pickup Spot *
          </label>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
            <input
              type="text"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              placeholder="e.g., Student Union Lobby, Science Library, Engineering Quad"
              className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                errors.pickupLocation ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
              }`}
            />
          </div>
          {errors.pickupLocation && <p className="text-xs text-rose-500 mt-1">{errors.pickupLocation}</p>}
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Search Tags (Comma separated)
          </label>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="e.g. math21a, calc, ti84, dorm"
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors"
          >
            Review & Publish Listing
          </button>
        </div>
      </form>

      {/* Price Guidance Modal */}
      <PriceGuidanceModal
        isOpen={showPriceGuide}
        onClose={() => setShowPriceGuide(false)}
      />

      {/* Confirmation Modal */}
      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmedPublish}
        title="Confirm Campus-Thrift Listing"
        description={`You are about to publish "${title}" for $${price} with pickup at ${pickupLocation}. This listing will be immediately visible to other students in the marketplace.`}
        confirmText={isSubmitting ? 'Publishing...' : 'Publish Now'}
      />
    </div>
  );
};
