export type Category = 
  | 'all'
  | 'textbooks'
  | 'electronics'
  | 'furniture'
  | 'dorm-essentials'
  | 'bicycles'
  | 'lab-equipment'
  | 'clothing'
  | 'other';

export type ProductCondition = 'brand-new' | 'like-new' | 'good' | 'fair';

export type ProductStatus = 'active' | 'sold';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  campus: string;
  dorm: string;
  department: string;
  graduationYear: string;
  verifiedStudent: boolean;
  rating: number;
  reviewCount: number;
  joinedDate: string;
  responseTime: string;
  bio?: string;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice: number;
  category: Exclude<Category, 'all'>;
  condition: ProductCondition;
  description: string;
  images: string[];
  sellerId: string;
  seller?: User;
  campus: string;
  pickupLocation: string;
  tags: string[];
  createdAt: string;
  status: ProductStatus;
  isSaved?: boolean;
  views?: number;
}

export interface Conversation {
  id: string;
  productId: string;
  participantIds: string[];
  lastMessage: string;
  lastMessageTimestamp: string;
  unreadCount: number;
  product?: Product;
  otherParticipant?: User;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  timestamp: string;
  isQuickOffer?: boolean;
  offerAmount?: number;
}

export type NotificationType = 'message' | 'offer' | 'listing_update' | 'safety';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  timestamp: string;
  isRead: boolean;
  link?: string;
}

export interface Ride {
  id: string;
  driverId: string;
  driverName: string;
  driverAvatar: string;
  driverRating: number;
  driverVerified: boolean;
  from: string;
  to: string;
  date: string;
  departureTime: string;
  price: number;
  availableSeats: number;
  totalSeats: number;
  vehicleInfo: string;
  notes?: string;
}

export interface Recommendation {
  product: Product;
  reason: string;
  matchScore: number;
}

export type ScamSeverity = 'info' | 'warning' | 'danger';

export interface ScamSignal {
  severity: ScamSeverity;
  title: string;
  description: string;
  advice: string;
}

export interface ScamAnalysisResult {
  hasWarning: boolean;
  maxSeverity: ScamSeverity;
  signals: ScamSignal[];
}

export interface ProductFilterState {
  query: string;
  category: Category;
  minPrice?: number;
  maxPrice?: number;
  condition?: ProductCondition | 'all';
  campus?: string;
  sortBy: 'newest' | 'price-asc' | 'price-desc' | 'savings';
}
