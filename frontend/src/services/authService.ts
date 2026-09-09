import { User } from '../types';
import { api, BackendUser } from './api';
import { mapBackendUser } from './productService';

const SESSION_KEY = 'campus_thrift_active_user';

/**
 * Auth Service — backed by the real FastAPI backend.
 *
 * Since the backend has no password auth, we use the "register-or-login"
 * pattern: POST /users/register returns the existing user if the email
 * already exists, so calling it acts as both sign-up and sign-in.
 *
 * The logged-in user object is persisted to localStorage so page
 * refreshes keep the session alive.
 */
class AuthService {
  private currentUser: User | null = null;

  constructor() {
    try {
      const stored = localStorage.getItem(SESSION_KEY);
      if (stored) {
        this.currentUser = JSON.parse(stored) as User;
      }
    } catch {
      this.currentUser = null;
    }
  }

  // -----------------------------------------------------------------------
  // Register or login with email — returns the User on success
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

  public isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  public logout(): void {
    this.currentUser = null;
    try {
      localStorage.removeItem(SESSION_KEY);
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
      const u = await api.get<BackendUser>(`/users/${this.currentUser.id}`);
      const refreshed = mapBackendUser(u);
      // Preserve the avatar from mock so it looks nice
      refreshed.avatar = this.currentUser.avatar;
      this.setSession(refreshed);
      return refreshed;
    } catch {
      return this.currentUser;
    }
  }
}

export const authService = new AuthService();
