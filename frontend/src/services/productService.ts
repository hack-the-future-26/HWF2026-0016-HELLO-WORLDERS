import { Product, ProductFilterState, ProductStatus, User } from '../types';
import { api, BackendProduct, BackendUser, resolveImageUrl } from './api';

const SAVED_ITEMS_KEY = 'campus_thrift_saved_products';
const VIEWED_ITEMS_KEY = 'campus_thrift_recently_viewed';

// ---------------------------------------------------------------------------
// Mapping helpers: backend shape → frontend shape
// ---------------------------------------------------------------------------

/** Convert a BackendUser (integer id) to the frontend User type. */
export function mapBackendUser(u: BackendUser): User {
  return {
    id: String(u.id),
    name: u.name,
    email: u.email,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.id}`,
    campus: u.college,
    dorm: 'Campus Housing',
    department: 'Undergraduate',
    graduationYear: 'Current Student',
    verifiedStudent: u.verified,
    rating: 4.8,
    reviewCount: 0,
    joinedDate: 'Recently',
    responseTime: 'Within a few hours',
  };
}

/** Convert a BackendProduct to the frontend Product type. */
export function mapBackendProduct(
  p: BackendProduct,
  seller?: User,
  isSaved = false,
): Product {
  return {
    id: String(p.id),
    title: p.title,
    price: p.price,
    originalPrice: p.price * 1.5, // backend doesn't store this; derive a default
    category: p.category as Product['category'],
    condition: p.condition as Product['condition'],
    description: p.description ?? '',
    images: [resolveImageUrl(p.image_url)],
    sellerId: String(p.seller_id),
    seller,
    campus: 'Main University Campus',
    pickupLocation: 'Campus – contact seller to arrange',
    tags: [p.category],
    createdAt: new Date().toISOString(),
    status: (p.status ?? 'active') as Product['status'],
    isSaved,
    views: 0,
  };
}

// ---------------------------------------------------------------------------
// ProductService
// ---------------------------------------------------------------------------

class ProductService {
  private savedProductIds: Set<string> = new Set();

  constructor() {
    this.loadSaved();
  }

  private loadSaved() {
    try {
      const stored = localStorage.getItem(SAVED_ITEMS_KEY);
      if (stored) this.savedProductIds = new Set(JSON.parse(stored));
    } catch {
      /* ignore */
    }
  }

  private persistSaved() {
    try {
      localStorage.setItem(
        SAVED_ITEMS_KEY,
        JSON.stringify(Array.from(this.savedProductIds)),
      );
    } catch {
      /* ignore */
    }
  }

  // -----------------------------------------------------------------------
  // Fetch a seller and cache it for mapping
  // -----------------------------------------------------------------------
  private sellerCache: Record<number, User> = {};

  private async fetchSeller(sellerId: number): Promise<User | undefined> {
    if (this.sellerCache[sellerId]) return this.sellerCache[sellerId];
    try {
      const u = await api.get<BackendUser>(`/users/${sellerId}`);
      const mapped = mapBackendUser(u);
      this.sellerCache[sellerId] = mapped;
      return mapped;
    } catch {
      return undefined;
    }
  }

  // -----------------------------------------------------------------------
  // getProducts
  // -----------------------------------------------------------------------
  public async getProducts(filters?: Partial<ProductFilterState>): Promise<Product[]> {
    const raw = await api.get<BackendProduct[]>('/products');

    let list = raw.map((p) =>
      mapBackendProduct(p, undefined, this.savedProductIds.has(String(p.id))),
    );

    if (!filters) return list;

    // --- client-side filters (backend doesn't support query params yet) ---
    if (filters.query?.trim()) {
      const q = filters.query.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      );
    }

    if (filters.category && filters.category !== 'all') {
      list = list.filter((p) => p.category === filters.category);
    }

    if (filters.condition && filters.condition !== 'all') {
      list = list.filter((p) => p.condition === filters.condition);
    }

    if (filters.minPrice !== undefined && filters.minPrice > 0) {
      list = list.filter((p) => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined && filters.maxPrice > 0) {
      list = list.filter((p) => p.price <= filters.maxPrice!);
    }

    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price-asc':
          list.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          list.sort((a, b) => b.price - a.price);
          break;
        // newest & savings: backend returns newest-last right now; reverse
        case 'newest':
          list.reverse();
          break;
      }
    }

    return list;
  }

  // -----------------------------------------------------------------------
  // getProductById
  // -----------------------------------------------------------------------
  public async getProductById(id: string): Promise<Product | null> {
    try {
      const p = await api.get<BackendProduct>(`/products/${id}`);
      const seller = await this.fetchSeller(p.seller_id);
      const product = mapBackendProduct(
        p,
        seller,
        this.savedProductIds.has(String(p.id)),
      );
      this.trackView(product.id);
      return product;
    } catch {
      return null;
    }
  }

  // -----------------------------------------------------------------------
  // createProduct  — called from SellForm via FormData (multipart)
  // -----------------------------------------------------------------------
  public async createProduct(
    data: Omit<Product, 'id' | 'createdAt' | 'status' | 'views'> & {
      sellerId: string;
      imageFile?: File;
    },
  ): Promise<Product> {
    const form = new FormData();
    form.append('seller_id', data.sellerId);
    form.append('title', data.title);
    form.append('category', data.category);
    form.append('price', String(data.price));
    form.append('condition', data.condition);
    if (data.description) form.append('description', data.description);
    if (data.imageFile) {
      form.append('image', data.imageFile);
    }

    const res = await api.postForm<{ success: boolean; product: BackendProduct }>(
      '/products',
      form,
    );

    return mapBackendProduct(res.product, undefined, false);
  }

  // -----------------------------------------------------------------------
  // updateProductStatus
  // -----------------------------------------------------------------------
  public async updateProductStatus(
    id: string,
    status: ProductStatus,
  ): Promise<Product | null> {
    try {
      const res = await api.patch<{ success: boolean; product: BackendProduct }>(
        `/products/${id}/status?status=${status}`,
      );
      return mapBackendProduct(res.product);
    } catch {
      return null;
    }
  }

  // -----------------------------------------------------------------------
  // deleteProduct
  // -----------------------------------------------------------------------
  public async deleteProduct(id: string): Promise<boolean> {
    try {
      await api.delete(`/products/${id}`);
      return true;
    } catch {
      return false;
    }
  }

  // -----------------------------------------------------------------------
  // getMyListings
  // -----------------------------------------------------------------------
  public async getMyListings(userId: string): Promise<Product[]> {
    const all = await api.get<BackendProduct[]>('/products');
    return all
      .filter((p) => String(p.seller_id) === userId)
      .map((p) => mapBackendProduct(p, undefined, this.savedProductIds.has(String(p.id))));
  }

  // -----------------------------------------------------------------------
  // Saved / wishlist helpers (local cache — backed by wishlist service)
  // -----------------------------------------------------------------------
  public async toggleSaveProduct(id: string): Promise<boolean> {
    if (this.savedProductIds.has(id)) {
      this.savedProductIds.delete(id);
    } else {
      this.savedProductIds.add(id);
    }
    this.persistSaved();
    return this.savedProductIds.has(id);
  }

  public getSavedProductIds(): string[] {
    return Array.from(this.savedProductIds);
  }

  public syncSavedIds(ids: string[]) {
    this.savedProductIds = new Set(ids);
    this.persistSaved();
  }

  public async getSavedProducts(): Promise<Product[]> {
    const ids = Array.from(this.savedProductIds);
    const results = await Promise.all(
      ids.map((id) => this.getProductById(id).catch(() => null)),
    );
    return results.filter((p): p is Product => p !== null);
  }

  // -----------------------------------------------------------------------
  // View tracking (local)
  // -----------------------------------------------------------------------
  private trackView(productId: string) {
    try {
      const stored = localStorage.getItem(VIEWED_ITEMS_KEY);
      const views: string[] = stored ? JSON.parse(stored) : [];
      const updated = [productId, ...views.filter((id) => id !== productId)].slice(0, 10);
      localStorage.setItem(VIEWED_ITEMS_KEY, JSON.stringify(updated));
    } catch {
      /* ignore */
    }
  }

  public getViewedProductIds(): string[] {
    try {
      const stored = localStorage.getItem(VIEWED_ITEMS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }
}

export const productService = new ProductService();
