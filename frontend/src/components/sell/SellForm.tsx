import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HelpCircle,
  MapPin,
  Image as ImageIcon,
  Upload,
  X,
} from 'lucide-react';
import { Category, ProductCondition } from '../../types';
import { productService } from '../../services/productService';
import { scamService } from '../../services/scamService';
import { useAuth } from '../../context/AuthContext';
import { PriceGuidanceModal } from './PriceGuidanceModal';
import { ScamWarning } from '../common/ScamWarning';
import { ConfirmDialog } from '../common/ConfirmDialog';

const MAX_FILE_SIZE_MB = 5;

export const SellForm: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Exclude<Category, 'all'>>('textbooks');
  const [price, setPrice] = useState<number | ''>('');
  const [originalPrice, setOriginalPrice] = useState<number | ''>('');
  const [condition, setCondition] = useState<ProductCondition>('good');
  const [description, setDescription] = useState('');
  const [pickupLocation, setPickupLocation] = useState('Science Library Lobby (Safe Zone)');
  const [tagsInput, setTagsInput] = useState('');

  // Image: either an uploaded File or a URL string
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPriceGuide, setShowPriceGuide] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Advisory scam analysis on the fly (synchronous / instant)
  const scamAnalysis = scamService.analyzeListing(
    title,
    description,
    typeof price === 'number' ? price : 0,
    category,
  );

  // -----------------------------------------------------------------------
  // Image picker handler
  // -----------------------------------------------------------------------
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        imageFile: `Image must be smaller than ${MAX_FILE_SIZE_MB} MB.`,
      }));
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setErrors((prev) => { const n = { ...prev }; delete n.imageFile; return n; });
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // -----------------------------------------------------------------------
  // Validation
  // -----------------------------------------------------------------------
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Listing title is required.';
    } else if (title.trim().length < 5) {
      newErrors.title = 'Title should be at least 5 characters.';
    }

    if (price === '' || price <= 0) {
      newErrors.price = 'Please enter a valid price greater than ₹0.';
    }

    if (originalPrice !== '' && typeof price === 'number' && (originalPrice as number) < price) {
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

    if (!imageFile) {
      newErrors.imageFile = 'A product photo is required. Please upload an image.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    if (validate()) {
      setShowConfirm(true);
    }
  };

  // -----------------------------------------------------------------------
  // Publish
  // -----------------------------------------------------------------------
  const handleConfirmedPublish = async () => {
    if (!user) return;
    setIsSubmitting(true);
    setSubmitError('');

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);
    if (tags.length === 0) tags.push(category);

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
        images: [],      // backend fills image_url from the uploaded file
        tags,
        imageFile: imageFile ?? undefined,
      });

      navigate(`/product/${created.id}`);
    } catch (err) {
      console.error('Failed to create product', err);
      setSubmitError(
        err instanceof Error ? err.message : 'Failed to publish listing. Please try again.',
      );
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

      {/* Advisory Warning Banner */}
      {scamAnalysis.hasWarning && <ScamWarning analysis={scamAnalysis} />}

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6"
      >
        {/* ---- Title ---- */}
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

        {/* ---- Category & Condition ---- */}
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

        {/* ---- Pricing ---- */}
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
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-bold">
                  ₹
                </span>
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
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-bold">
                  ₹
                </span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={originalPrice}
                  onChange={(e) =>
                    setOriginalPrice(e.target.value ? Number(e.target.value) : '')
                  }
                  placeholder="Original Retail Price (Optional)"
                  className="w-full pl-8 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Helps show students how much they save</p>
            </div>
          </div>
        </div>

        {/* ---- Description ---- */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Description *
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Include course codes (e.g. MATH 21A), warranty status, included accessories, or reason for selling."
            className={`w-full p-3.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
              errors.description ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
            }`}
          />
          {errors.description && (
            <p className="text-xs text-rose-500 mt-1">{errors.description}</p>
          )}
        </div>

        {/* ---- Product Photo (file upload) ---- */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Product Photo *
          </label>

          {imagePreview ? (
            /* Preview + clear button */
            <div className="relative w-full h-48 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={clearImage}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/60 hover:bg-rose-600 text-white transition-colors"
                title="Remove photo"
              >
                <X className="w-4 h-4" />
              </button>
              <span className="absolute bottom-2 left-2 text-[11px] bg-slate-900/60 text-white px-2 py-0.5 rounded-full">
                {imageFile?.name}
              </span>
            </div>
          ) : (
            /* Upload dropzone */
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`w-full h-36 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 text-slate-500 dark:text-slate-400 hover:border-emerald-400 dark:hover:border-emerald-600 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors ${
                errors.imageFile
                  ? 'border-rose-400 text-rose-500'
                  : 'border-slate-300 dark:border-slate-700'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800">
                <Upload className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold">Click to upload photo</span>
              <span className="text-[11px]">JPG, PNG, WEBP — max {MAX_FILE_SIZE_MB} MB</span>
            </button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            className="hidden"
          />

          {errors.imageFile && (
            <p className="text-xs text-rose-500 mt-1">{errors.imageFile}</p>
          )}
        </div>

        {/* ---- Campus Pickup Spot ---- */}
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
          {errors.pickupLocation && (
            <p className="text-xs text-rose-500 mt-1">{errors.pickupLocation}</p>
          )}
        </div>

        {/* ---- Tags ---- */}
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

        {/* ---- Submit error ---- */}
        {submitError && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300">
            {submitError}
          </div>
        )}

        {/* ---- Action Buttons ---- */}
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
      <PriceGuidanceModal isOpen={showPriceGuide} onClose={() => setShowPriceGuide(false)} />

      {/* Confirmation Modal */}
      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmedPublish}
        title="Confirm Campus-Thrift Listing"
        description={`You are about to publish "${title}" for ₹${price} with pickup at ${pickupLocation}. This listing will be immediately visible to other students.`}
        confirmText={isSubmitting ? 'Publishing…' : 'Publish Now'}
      />
    </div>
  );
};
