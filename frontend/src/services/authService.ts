import { User } from '../types';
import { api, BackendUser, AUTH_TOKEN_KEY } from './api';
import { mapBackendUser } from './productService';

const SESSION_KEY = 'campus_thrift_active_user';

/**
 * Auth Service — backed by JWT authentication on FastAPI.
 */
class AuthService {
  private currentUser: User | null = null;

  constructor() {
    try {
      const stored = localStorage.getItem(SESSION_KEY);
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (stored && token) {
        this.currentUser = JSON.parse(stored) as User;
      } else {
        this.currentUser = null;
      }
    } catch {
      this.currentUser = null;
    }
  }

  // -----------------------------------------------------------------------
  // Login with email and password via JWT
  // -----------------------------------------------------------------------
  public async login(email: string, password: string): Promise<User> {
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

    const user = mapBackendUser(res.user);
    this.setSession(user);
    return user;
  }

  // -----------------------------------------------------------------------
  // Register with email and password via JWT
  // -----------------------------------------------------------------------
  public async register(
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

    const user = mapBackendUser(res.user);
    this.setSession(user);
    return user;
  }

  // -----------------------------------------------------------------------
  // Backward compatibility: Register or login with email
  // -----------------------------------------------------------------------
  public async registerOrLogin(
    name: string,
    email: string,
    college: string,
  ): Promise<User> {
    const res = await api.post<{ success: boolean; message: string; user: BackendUser }>(
      '/users/register',
      { name, email, college },
    );

    if (!res.success || !res.user) {
      throw new Error(res.message || 'Registration failed');
    }

    const user = mapBackendUser(res.user);
    this.setSession(user);
    return user;
  }

  // -----------------------------------------------------------------------
  // Session helpers
  // -----------------------------------------------------------------------
  private setSession(user: User) {
    this.currentUser = user;
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } catch {
      /* ignore */
    }
  }

  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  public getToken(): string | null {
    try {
      return localStorage.getItem(AUTH_TOKEN_KEY);
    } catch {
      return null;
    }
  }

  public isAuthenticated(): boolean {
    return this.currentUser !== null && !!this.getToken();
  }

  public logout(): void {
    this.currentUser = null;
    try {
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(AUTH_TOKEN_KEY);
    } catch {
      /* ignore */
    }
  }

  // -----------------------------------------------------------------------
  // Refresh the user from the backend (e.g. after profile changes)
  // -----------------------------------------------------------------------
  public async refreshCurrentUser(): Promise<User | null> {
    if (!this.currentUser) return null;
    try {
      const u = await api.get<BackendUser>('/auth/me');
      const refreshed = mapBackendUser(u);
      refreshed.avatar = this.currentUser.avatar;
      this.setSession(refreshed);
      return refreshed;
    } catch {
      return this.currentUser;
    }
  }
}

export const authService = new AuthService();
