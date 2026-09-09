import { User } from '../types';
import { mockUsers } from '../data/mockData';

const SESSION_STORAGE_KEY = 'campus_thrift_active_user_id';

/**
 * Frontend Mock Authentication Service
 * 
 * NOTE: This is a frontend demo service. It does not implement real backend
 * authentication, passwords, JWT tokens, or server sessions.
 */
class AuthService {
  private activeUserId: string | null = null;

  constructor() {
    // Restore session from localStorage if available
    try {
      const stored = localStorage.getItem(SESSION_STORAGE_KEY);
      if (stored) {
        this.activeUserId = stored;
      } else {
        // Default to Alex Rivera for convenient hackathon demo exploration
        this.activeUserId = 'user-alex';
        localStorage.setItem(SESSION_STORAGE_KEY, 'user-alex');
      }
    } catch {
      this.activeUserId = 'user-alex';
    }
  }

  // TODO: [Backend Integration] Replace with GET /api/auth/me
  public getCurrentUser(): User | null {
    if (!this.activeUserId) return null;
    return mockUsers.find(u => u.id === this.activeUserId) || null;
  }

  public getDemoUsers(): User[] {
    return mockUsers;
  }

  // TODO: [Backend Integration] Replace with POST /api/auth/login
  public loginAs(userId: string): User | null {
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      this.activeUserId = user.id;
      try {
        localStorage.setItem(SESSION_STORAGE_KEY, user.id);
      } catch (e) {
        console.error('Storage error', e);
      }
      return user;
    }
    return null;
  }

  // TODO: [Backend Integration] Replace with POST /api/auth/logout
  public logout(): void {
    this.activeUserId = null;
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } catch (e) {
      console.error('Storage error', e);
    }
  }

  public isAuthenticated(): boolean {
    return this.activeUserId !== null;
  }
}

export const authService = new AuthService();
