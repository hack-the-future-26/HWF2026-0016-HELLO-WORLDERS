/**
 * Central API client — all requests proxy through Vite to http://localhost:8000
 * Proxy: /api/* → http://localhost:8000/* (strips /api prefix)
 */

export const API_BASE = "/api";
export const UPLOADS_BASE = "http://localhost:8000";

// ── Generic fetch helpers ─────────────────────────────────────────────────────

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  isForm = false,
): Promise<T> {
  const headers: Record<string, string> = {};
  if (body && !isForm) headers["Content-Type"] = "application/json";

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: isForm
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
    } catch { /* ignore */ }
    throw new Error(`${method} ${path} → ${res.status}: ${detail}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string) => request<T>("GET", path),
  post: <T>(path: string, body: unknown) => request<T>("POST", path, body),
  patch: <T>(path: string, body?: unknown) => request<T>("PATCH", path, body),
  delete: <T>(path: string) => request<T>("DELETE", path),
  postForm: <T>(path: string, form: FormData) => request<T>("POST", path, form, true),
};

// ── Backend response shapes ───────────────────────────────────────────────────

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
  last_message_id: number;
  other_user: {
    id: number;
    name: string;
    email: string;
    college: string;
    verified: boolean;
  } | null;
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

// ── Helpers ───────────────────────────────────────────────────────────────────

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=800";

/** Resolve a relative /uploads/… path or keep an absolute URL as-is. */
export function resolveImage(url: string | null | undefined): string {
  if (!url) return FALLBACK_IMAGE;
  if (url.startsWith("http")) return url;
  return `${UPLOADS_BASE}${url}`;
}
