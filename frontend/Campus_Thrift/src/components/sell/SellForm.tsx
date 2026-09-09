import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle, MapPin, Upload, X } from 'lucide-react';
import { Category, ProductCondition } from '../../types';
import { productService } from '../../services/productService';
import { scamService } from '../../services/scamService';
import { useAuth } from '../../context/AuthContext';
import { PriceGuidanceModal } from './PriceGuidanceModal';
import { ScamWarning } from '../common/ScamWarning';
import { ConfirmDialog } from '../common/ConfirmDialog';

const MAX_MB = 5;

export const SellForm: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Exclude<Category, 'all'>>('textbooks');
  const [price, setPrice] = useState<number | ''>('');
  const [condition, setCondition] = useState<ProductCondition>('good');
  const [description, setDescription] = useState('');
  const [pickupLocation, setPickupLocation] = useState('Central Library (Ground Floor)');
  const [tagsInput, setTagsInput] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPriceGuide, setShowPriceGuide] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const scamAnalysis = scamService.analyzeListing(
    title,
    description,
    typeof price === 'number' ? price : 0,
    category,
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_MB * 1024 * 1024) {
      setErrors(p => ({ ...p, imageFile: `Image must be under ${MAX_MB} MB.` }));
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setErrors(p => { const n = { ...p }; delete n.imageFile; return n; });
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview('');
    if (fileRef.current) fileRef.current.value = '';
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!title.trim() || title.trim().length < 5)
      e.title = 'Title must be at least 5 characters.';
    if (price === '' || Number(price) <= 0)
      e.price = 'Enter a valid price greater than ₹0.';
    if (!description.trim() || description.trim().length < 15)
      e.description = 'Description must be at least 15 characters.';
    if (!pickupLocation.trim())
      e.pickupLocation = 'Campus pickup location is required.';
    if (!imageFile)
      e.imageFile = 'Please upload a product photo.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    if (validate()) setShowConfirm(true);
  };

  const handlePublish = async () => {
    if (!user) return;
    setIsSubmitting(true);
    setSubmitError('');

    const tags = tagsInput
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(Boolean);
    if (tags.length === 0) tags.push(category);

    try {
      const created = await productService.createProduct({
        sellerId: user.id,
        title: title.trim(),
        category,
        price: Number(price),
        condition,
        description: description.trim(),
        imageFile: imageFile ?? undefined,
      });
      navigate(`/product/${created.id}`);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to publish. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          CampusThrift पर Item List करें
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          पुरानी किताबें, electronics, और hostel gear बेचकर पैसे कमाएं।
        </p>
      </div>

      {scamAnalysis.hasWarning && <ScamWarning analysis={scamAnalysis} />}

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6"
      >
        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Listing Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="जैसे: R.D. Sharma Class 12 या Casio fx-991ES Calculator"
            className={`w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
              errors.title ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
            }`}
          />
          {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title}</p>}
        </div>

        {/* Category + Condition */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Category *
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as Exclude<Category, 'all'>)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="textbooks">Textbooks &amp; Notes</option>
              <option value="electronics">Electronics &amp; Gadgets</option>
              <option value="dorm-essentials">Hostel Essentials</option>
              <option value="furniture">Furniture &amp; Storage</option>
              <option value="bicycles">Cycle &amp; Transport</option>
              <option value="lab-equipment">Lab Equipment &amp; STEM</option>
              <option value="clothing">Clothes &amp; Bags</option>
              <option value="other">Other Campus Gear</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Condition *
            </label>
            <select
              value={condition}
              onChange={e => setCondition(e.target.value as ProductCondition)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="brand-new">बिल्कुल नया (Sealed)</option>
              <option value="like-new">Like New (barely used)</option>
              <option value="good">Good (normal wear)</option>
              <option value="fair">Fair (visible wear, works fine)</option>
            </select>
          </div>
        </div>

        {/* Price */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Selling Price (₹) *
            </label>
            <button
              type="button"
              onClick={() => setShowPriceGuide(true)}
              className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Price Guidance</span>
            </button>
          </div>
          <div className="relative max-w-xs">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-bold">₹</span>
            <input
              type="number"
              min="1"
              step="1"
              value={price}
              onChange={e => setPrice(e.target.value ? Number(e.target.value) : '')}
              placeholder="जैसे: 350"
              className={`w-full pl-8 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                errors.price ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
              }`}
            />
          </div>
          {errors.price && <p className="text-xs text-rose-500 mt-1">{errors.price}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Description *
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Item की condition, कोई accessories included हैं, selling reason — सब mention करें।"
            className={`w-full p-3.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
              errors.description ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
            }`}
          />
          {errors.description && <p className="text-xs text-rose-500 mt-1">{errors.description}</p>}
        </div>

        {/* Photo Upload */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Product Photo *
          </label>
          {imagePreview ? (
            <div className="relative w-full h-48 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={clearImage}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/60 hover:bg-rose-600 text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <span className="absolute bottom-2 left-2 text-[11px] bg-slate-900/60 text-white px-2 py-0.5 rounded-full truncate max-w-[80%]">
                {imageFile?.name}
              </span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className={`w-full h-36 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 text-slate-500 dark:text-slate-400 hover:border-emerald-400 hover:text-emerald-600 dark:hover:border-emerald-600 dark:hover:text-emerald-400 transition-colors ${
                errors.imageFile ? 'border-rose-400 text-rose-400' : 'border-slate-300 dark:border-slate-700'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800">
                <Upload className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold">Photo upload करें</span>
              <span className="text-[11px]">JPG, PNG, WEBP — max {MAX_MB} MB</span>
            </button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />
          {errors.imageFile && <p className="text-xs text-rose-500 mt-1">{errors.imageFile}</p>}
        </div>

        {/* Pickup Location */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Campus Pickup Location *
          </label>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
            <input
              type="text"
              value={pickupLocation}
              onChange={e => setPickupLocation(e.target.value)}
              placeholder="जैसे: Central Library, Hostel 5 Gate, Admin Block Lobby"
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
            Search Tags (comma separated)
          </label>
          <input
            type="text"
            value={tagsInput}
            onChange={e => setTagsInput(e.target.value)}
            placeholder="जैसे: rd sharma, class12, maths, cbse"
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {submitError && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300">
            {submitError}
          </div>
        )}

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
            Review &amp; Publish
          </button>
        </div>
      </form>

      <PriceGuidanceModal isOpen={showPriceGuide} onClose={() => setShowPriceGuide(false)} />

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handlePublish}
        title="Listing Publish करें?"
        description={`"${title}" को ₹${price} में publish करने जा रहे हैं — pickup: ${pickupLocation}. यह listing तुरंत marketplace पर दिखेगी।`}
        confirmText={isSubmitting ? 'Publishing…' : 'Publish Now'}
      />
    </div>
  );
};
