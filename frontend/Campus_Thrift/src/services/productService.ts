import { Product, ProductFilterState, ProductStatus } from '../types';
import { api, BackendProduct, BackendUser, resolveImage } from './api';

const SAVED_KEY = 'ct_saved_ids';
const VIEWED_KEY = 'ct_viewed_ids';

// ── mappers ───────────────────────────────────────────────────────────────────

export function mapUser(u: BackendUser) {
  return {
    id: String(u.id),
    name: u.name,
    email: u.email,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.id}`,
    campus: u.college,
    dorm: 'Campus Hostel',
    department: 'Student',
    graduationYear: 'Current Student',
    verifiedStudent: u.verified,
    rating: 4.8,
    reviewCount: 0,
    joinedDate: 'Recently',
    responseTime: 'Within a few hours',
  };
}

export function mapProduct(p: BackendProduct, isSaved = false): Product {
  return {
    id: String(p.id),
    title: p.title,
    price: p.price,
    originalPrice: Math.round(p.price * 1.6),
    category: p.category as Product['category'],
    condition: p.condition as Product['condition'],
    description: p.description ?? '',
    images: [resolveImage(p.image_url)],
    sellerId: String(p.seller_id),
    campus: 'Main Campus',
    pickupLocation: 'Contact seller to arrange campus pickup',
    tags: [p.category],
    createdAt: new Date().toISOString(),
    status: (p.status ?? 'active') as Product['status'],
    isSaved,
    views: 0,
  };
}

// ── service ───────────────────────────────────────────────────────────────────

class ProductService {
  private savedIds: Set<string> = new Set();
  private sellerCache: Record<number, ReturnType<typeof mapUser>> = {};

  constructor() {
    try {
      const s = localStorage.getItem(SAVED_KEY);
      if (s) this.savedIds = new Set(JSON.parse(s));
    } catch { /* ignore */ }
  }

  private persistSaved() {
    try { localStorage.setItem(SAVED_KEY, JSON.stringify([...this.savedIds])); } catch { /* ignore */ }
  }

  // Fetch seller; cached per session
  private async fetchSeller(id: number) {
    if (this.sellerCache[id]) return this.sellerCache[id];
    try {
      const u = await api.get<BackendUser>(`/users/${id}`);
      this.sellerCache[id] = mapUser(u);
      return this.sellerCache[id];
    } catch { return undefined; }
  }

  // ── public API ──────────────────────────────────────────────────────────────

  async getProducts(filters?: Partial<ProductFilterState>): Promise<Product[]> {
    const raw = await api.get<BackendProduct[]>('/products');
    let list = raw.map(p => mapProduct(p, this.savedIds.has(String(p.id))));

    if (!filters) return list;

    if (filters.query?.trim()) {
      const q = filters.query.toLowerCase();
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }
    if (filters.category && filters.category !== 'all')
      list = list.filter(p => p.category === filters.category);
    if (filters.condition && filters.condition !== 'all')
      list = list.filter(p => p.condition === filters.condition);
    if (filters.minPrice && filters.minPrice > 0)
      list = list.filter(p => p.price >= filters.minPrice!);
    if (filters.maxPrice && filters.maxPrice > 0)
      list = list.filter(p => p.price <= filters.maxPrice!);

    switch (filters.sortBy) {
      case 'price-asc':  list.sort((a, b) => a.price - b.price); break;
      case 'price-desc': list.sort((a, b) => b.price - a.price); break;
      case 'newest':     list.reverse(); break;
    }
    return list;
  }

  async getProductById(id: string): Promise<Product | null> {
    try {
      const p = await api.get<BackendProduct>(`/products/${id}`);
      const seller = await this.fetchSeller(p.seller_id);
      const product = mapProduct(p, this.savedIds.has(String(p.id)));
      if (seller) product.seller = seller;
      this.trackView(id);
      return product;
    } catch { return null; }
  }

  async createProduct(data: {
    sellerId: string;
    title: string;
    category: string;
    price: number;
    condition: string;
    description: string;
    imageFile?: File;
  }): Promise<Product> {
    const form = new FormData();
    form.append('seller_id', data.sellerId);
    form.append('title', data.title);
    form.append('category', data.category);
    form.append('price', String(data.price));
    form.append('condition', data.condition);
    if (data.description) form.append('description', data.description);
    if (data.imageFile) form.append('image', data.imageFile);

    const res = await api.postForm<{ success: boolean; product: BackendProduct }>('/products', form);
    return mapProduct(res.product);
  }

  async updateProductStatus(id: string, status: ProductStatus): Promise<Product | null> {
    try {
      const res = await api.patch<{ success: boolean; product: BackendProduct }>(
        `/products/${id}/status?status=${status}`
      );
      return mapProduct(res.product);
    } catch { return null; }
  }

  async deleteProduct(id: string): Promise<boolean> {
    try { await api.delete(`/products/${id}`); return true; }
    catch { return false; }
  }

  async getMyListings(userId: string): Promise<Product[]> {
    const all = await api.get<BackendProduct[]>('/products');
    return all
      .filter(p => String(p.seller_id) === userId)
      .map(p => mapProduct(p, this.savedIds.has(String(p.id))));
  }

  // Wishlist helpers (local cache — synced by SavedProductsContext)
  async toggleSaveProduct(id: string): Promise<boolean> {
    if (this.savedIds.has(id)) this.savedIds.delete(id);
    else this.savedIds.add(id);
    this.persistSaved();
    return this.savedIds.has(id);
  }
  getSavedProductIds() { return [...this.savedIds]; }
  syncSavedIds(ids: string[]) { this.savedIds = new Set(ids); this.persistSaved(); }
  async getSavedProducts(): Promise<Product[]> {
    const ids = [...this.savedIds];
    const results = await Promise.all(ids.map(id => this.getProductById(id).catch(() => null)));
    return results.filter((p): p is Product => p !== null);
  }

  // View tracking
  private trackView(id: string) {
    try {
      const s = localStorage.getItem(VIEWED_KEY);
      const v: string[] = s ? JSON.parse(s) : [];
      localStorage.setItem(VIEWED_KEY, JSON.stringify([id, ...v.filter(x => x !== id)].slice(0, 10)));
    } catch { /* ignore */ }
  }
  getViewedProductIds(): string[] {
    try { const s = localStorage.getItem(VIEWED_KEY); return s ? JSON.parse(s) : []; }
    catch { return []; }
  }
}

export const productService = new ProductService();
