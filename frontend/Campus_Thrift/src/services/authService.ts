import { User } from '../types';
import { api, BackendUser } from './api';
import { mapUser } from './productService';

const SESSION_KEY = 'ct_session_user';

class AuthService {
  private currentUser: User | null = null;

  constructor() {
    try {
      const s = localStorage.getItem(SESSION_KEY);
      if (s) this.currentUser = JSON.parse(s) as User;
    } catch { this.currentUser = null; }
  }

  /** Register-or-login: backend returns existing user if email already exists. */
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
    try { localStorage.setItem(SESSION_KEY, JSON.stringify(user)); } catch { /* ignore */ }
  }

  getCurrentUser(): User | null { return this.currentUser; }
  isAuthenticated(): boolean { return this.currentUser !== null; }

  logout(): void {
    this.currentUser = null;
    try { localStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
  }

  async refreshCurrentUser(): Promise<User | null> {
    if (!this.currentUser) return null;
    try {
      const u = await api.get<BackendUser>(`/users/${this.currentUser.id}`);
      const refreshed = { ...mapUser(u), avatar: this.currentUser.avatar };
      this.setSession(refreshed);
      return refreshed;
    } catch { return this.currentUser; }
  }
}

export const authService = new AuthService();
