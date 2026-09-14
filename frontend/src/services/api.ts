/**
 * Campus Thrift — central API client
 *
 * All requests go to the FastAPI backend at http://localhost:8000.
 * The Vite dev proxy re-routes /api/* → http://localhost:8000/* so the
 * frontend never has to hard-code the host in production builds.
 */

export const API_BASE = '/api';

// ---------------------------------------------------------------------------
// Generic fetch helpers
// ---------------------------------------------------------------------------

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  isFormData = false,
): Promise<T> {
  const headers: Record<string, string> = {};
  if (body && !isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: isFormData
      ? (body as FormData)
      : body !== undefined
      ? JSON.stringify(body)
      : undefined,
  });

  if (!res.ok) {
    let detail = res.statusText;
    try {
      const err = await res.json();
      detail = err.detail || err.message || detail;
    } catch {
      /* ignore parse errors */
    }
    throw new Error(`API ${method} ${path} failed (${res.status}): ${detail}`);
  }

  return res.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body: unknown) => request<T>('POST', path, body),
  patch: <T>(path: string, body?: unknown) => request<T>('PATCH', path, body),
  delete: <T>(path: string) => request<T>('DELETE', path),
  postForm: <T>(path: string, form: FormData) =>
    request<T>('POST', path, form, true),
};

// ---------------------------------------------------------------------------
// Backend response shapes (minimal — only what the frontend needs)
// ---------------------------------------------------------------------------

export interface BackendUser {
  id: number;
  name: string;
  email: string;
  college: string;
  verified: boolean;
  latitude: number | null;
  longitude: number | null;
}

export interface BackendProduct {
  id: number;
  seller_id: number;
  title: string;
  category: string;
  price: number;
  condition: string;
  description: string | null;
  image_url: string | null;
  latitude: number | null;
  longitude: number | null;
  status: string;
}

export interface BackendChat {
  id: number;
  product_id: number;
  buyer_id: number;
  seller_id: number;
  last_message: string | null;
  other_user: BackendUser | null;
  product: {
    id: number;
    title: string;
    price: number;
    image_url: string | null;
    condition: string;
  } | null;
}

export interface BackendMessage {
  id: number;
  chat_id: number;
  sender_id: number;
  message: string;
}

export interface BackendWishlistItem {
  wishlist_id: number;
  product_id: number;
  title: string;
  category: string;
  price: number;
  condition: string;
  description: string | null;
  image_url: string | null;
}

// ---------------------------------------------------------------------------
// Thin domain-level helpers used by the service layer
// ---------------------------------------------------------------------------

const IMG_BASE = 'http://localhost:8000';

/** Resolve a relative /uploads/... path to a full URL. */
export function resolveImageUrl(imageUrl: string | null | undefined): string {
  if (!imageUrl) return 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800';
  if (imageUrl.startsWith('http')) return imageUrl;
  return `${IMG_BASE}${imageUrl}`;
}
