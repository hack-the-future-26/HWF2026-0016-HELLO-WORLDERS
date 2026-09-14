import { User } from '../types';
import { api, BackendUser, AUTH_TOKEN_KEY } from './api';
import { mapUser } from './productService';

const SESSION_KEY = 'ct_session_user';

class AuthService {
  private currentUser: User | null = null;

  constructor() {
    try {
      const s = localStorage.getItem(SESSION_KEY);
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (s && token) {
        this.currentUser = JSON.parse(s) as User;
      } else {
        this.currentUser = null;
      }
    } catch {
      this.currentUser = null;
    }
  }

  /** Log in with email and password via JWT */
  async login(email: string, password: string): Promise<User> {
    const res = await api.post<{
      access_token: string;
      token_type: string;
      user: BackendUser;
    }>('/auth/login', { email, password });

    if (!res.access_token || !res.user) {
      throw new Error('Authentication failed');
    }

    try {
      localStorage.setItem(AUTH_TOKEN_KEY, res.access_token);
    } catch {
      /* ignore */
    }

    const user = mapUser(res.user);
    this.setSession(user);
    return user;
  }

  /** Register with email and password via JWT */
  async register(
    name: string,
    email: string,
    password: string,
    college?: string,
  ): Promise<User> {
    const res = await api.post<{
      access_token: string;
      token_type: string;
      user: BackendUser;
    }>('/auth/register', { name, email, password, college });

    if (!res.access_token || !res.user) {
      throw new Error('Registration failed');
    }

    try {
      localStorage.setItem(AUTH_TOKEN_KEY, res.access_token);
    } catch {
      /* ignore */
    }

    const user = mapUser(res.user);
    this.setSession(user);
    return user;
  }

  /** Register-or-login fallback: backend returns existing user if email already exists. */
  async registerOrLogin(name: string, email: string, college: string): Promise<User> {
    const res = await api.post<{ success: boolean; message: string; user?: BackendUser }>(
      '/users/register',
      { name, email, college }
    );
    if (!res.success || !res.user) {
      throw new Error(res.message || 'Registration failed. Please try again.');
    }
    const user = mapUser(res.user);
    this.setSession(user);
    return user;
  }

  private setSession(user: User) {
    this.currentUser = user;
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } catch {
      /* ignore */
    }
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  getToken(): string | null {
    try {
      return localStorage.getItem(AUTH_TOKEN_KEY);
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null && !!this.getToken();
  }

  logout(): void {
    this.currentUser = null;
    try {
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(AUTH_TOKEN_KEY);
    } catch {
      /* ignore */
    }
  }

  async refreshCurrentUser(): Promise<User | null> {
    if (!this.currentUser) return null;
    try {
      const u = await api.get<BackendUser>('/auth/me');
      const refreshed = { ...mapUser(u), avatar: this.currentUser.avatar };
      this.setSession(refreshed);
      return refreshed;
    } catch {
      return this.currentUser;
    }
  }
}

export const authService = new AuthService();
