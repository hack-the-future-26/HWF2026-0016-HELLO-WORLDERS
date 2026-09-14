import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, college?: string) => Promise<void>;
  /** Register or log in with name + email + college (legacy fallback). Throws on error. */
  registerOrLogin: (name: string, email: string, college: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => authService.getCurrentUser());

  useEffect(() => { setUser(authService.getCurrentUser()); }, []);

  const login = async (email: string, password: string) => {
    const loggedIn = await authService.login(email, password);
    setUser(loggedIn);
  };

  const register = async (name: string, email: string, password: string, college?: string) => {
    const loggedIn = await authService.register(name, email, password, college);
    setUser(loggedIn);
  };

  const registerOrLogin = async (name: string, email: string, college: string) => {
    const u = await authService.registerOrLogin(name, email, college);
    setUser(u);
  };

  const logout = () => { authService.logout(); setUser(null); };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        registerOrLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
