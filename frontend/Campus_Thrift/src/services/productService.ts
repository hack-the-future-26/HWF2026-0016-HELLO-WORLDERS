import { Product, ProductFilterState, ProductStatus, User } from '../types';
import { mockProducts, mockUsers } from '../data/mockData';

const LOCAL_PRODUCTS_KEY = 'campus_thrift_custom_products';
const SAVED_ITEMS_KEY = 'campus_thrift_saved_products';
const VIEWED_ITEMS_KEY = 'campus_thrift_recently_viewed';

class ProductService {
  private customProducts: Product[] = [];
  private savedProductIds: Set<string> = new Set();

  constructor() {
    this.loadState();
  }

  private loadState() {
    try {
      const stored = localStorage.getItem(LOCAL_PRODUCTS_KEY);
      if (stored) {
        this.customProducts = JSON.parse(stored);
      }
      const savedStored = localStorage.getItem(SAVED_ITEMS_KEY);
      if (savedStored) {
        this.savedProductIds = new Set(JSON.parse(savedStored));
      }
    } catch (e) {
      console.error('Failed to load local product state', e);
    }
  }

  private getAllProductsList(): Product[] {
    // Combine mock seed products with custom user-created products
    const combined = [...this.customProducts, ...mockProducts];
    return combined.map(product => {
      const seller = mockUsers.find(u => u.id === product.sellerId) || {
        id: product.sellerId,
        name: 'Campus Student',
        email: 'student@campus.edu',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
        campus: product.campus || 'Main University Campus',
        dorm: 'Campus Housing',
        department: 'Undergraduate',
        graduationYear: 'Class of 2026',
        verifiedStudent: true,
        rating: 4.9,
        reviewCount: 5,
        joinedDate: 'Recent',
        responseTime: 'Under 1 hour'
      };

      return {
        ...product,
        seller,
        isSaved: this.savedProductIds.has(product.id)
      };
    });
  }

  // TODO: [Backend Integration] Replace with GET /api/products?query=...&category=...
  public async getProducts(filters?: Partial<ProductFilterState>): Promise<Product[]> {
    let list = this.getAllProductsList();

    if (!filters) return list;

    // Search query filter
    if (filters.query && filters.query.trim()) {
      const q = filters.query.toLowerCase().trim();
      list = list.filter(p => 
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q)) ||
        p.campus.toLowerCase().includes(q) ||
        p.pickupLocation.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (filters.category && filters.category !== 'all') {
      list = list.filter(p => p.category === filters.category);
    }

    // Condition filter
    if (filters.condition && filters.condition !== 'all') {
      list = list.filter(p => p.condition === filters.condition);
    }

    // Min / Max price filter
    if (filters.minPrice !== undefined && filters.minPrice > 0) {
      list = list.filter(p => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined && filters.maxPrice > 0) {
      list = list.filter(p => p.price <= filters.maxPrice!);
    }

    // Campus location filter
    if (filters.campus && filters.campus.trim()) {
      const c = filters.campus.toLowerCase();
      list = list.filter(p => p.campus.toLowerCase().includes(c) || p.pickupLocation.toLowerCase().includes(c));
    }

    // Sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'newest':
          list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
        case 'price-asc':
          list.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          list.sort((a, b) => b.price - a.price);
          break;
        case 'savings':
          list.sort((a, b) => {
            const savingsA = a.originalPrice ? a.originalPrice - a.price : 0;
            const savingsB = b.originalPrice ? b.originalPrice - b.price : 0;
            return savingsB - savingsA;
          });
          break;
      }
    }

    return list;
  }

  // TODO: [Backend Integration] Replace with GET /api/products/:id
  public async getProductById(id: string): Promise<Product | null> {
    const list = this.getAllProductsList();
    const found = list.find(p => p.id === id);
    if (found) {
      this.trackView(found.id);
      return found;
    }
    return null;
  }

  // TODO: [Backend Integration] Replace with POST /api/products/:id/save
  public async toggleSaveProduct(id: string): Promise<boolean> {
    if (this.savedProductIds.has(id)) {
      this.savedProductIds.delete(id);
    } else {
      this.savedProductIds.add(id);
    }
    try {
      localStorage.setItem(SAVED_ITEMS_KEY, JSON.stringify(Array.from(this.savedProductIds)));
    } catch (e) {
      console.error('Failed to save bookmark in local storage', e);
    }
    return this.savedProductIds.has(id);
  }

  public getSavedProductIds(): string[] {
    return Array.from(this.savedProductIds);
  }

  public async getSavedProducts(): Promise<Product[]> {
    const list = this.getAllProductsList();
    return list.filter(p => this.savedProductIds.has(p.id));
  }

  // TODO: [Backend Integration] Replace with POST /api/products
  public async createProduct(data: Omit<Product, 'id' | 'createdAt' | 'status' | 'views'>): Promise<Product> {
    const newProduct: Product = {
      ...data,
      id: `prod-custom-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'active',
      views: 1
    };

    this.customProducts.unshift(newProduct);
    try {
      localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(this.customProducts));
    } catch (e) {
      console.error('Failed to store custom product', e);
    }

    return newProduct;
  }

  // TODO: [Backend Integration] Replace with PATCH /api/products/:id/status
  public async updateProductStatus(id: string, status: ProductStatus): Promise<Product | null> {
    // Check if custom product
    const customIndex = this.customProducts.findIndex(p => p.id === id);
    if (customIndex >= 0) {
      this.customProducts[customIndex].status = status;
      try {
        localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(this.customProducts));
      } catch (e) {
        console.error('Storage error', e);
      }
      return this.customProducts[customIndex];
    }

    // Check mock products
    const seedIndex = mockProducts.findIndex(p => p.id === id);
    if (seedIndex >= 0) {
      mockProducts[seedIndex].status = status;
      return mockProducts[seedIndex];
    }

    return null;
  }

  // TODO: [Backend Integration] Replace with GET /api/users/:userId/listings
  public async getMyListings(userId: string): Promise<Product[]> {
    const all = this.getAllProductsList();
    return all.filter(p => p.sellerId === userId);
  }

  private trackView(productId: string) {
    try {
      const stored = localStorage.getItem(VIEWED_ITEMS_KEY);
      const views: string[] = stored ? JSON.parse(stored) : [];
      const updated = [productId, ...views.filter(id => id !== productId)].slice(0, 10);
      localStorage.setItem(VIEWED_ITEMS_KEY, JSON.stringify(updated));
    } catch {
      // ignore
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
