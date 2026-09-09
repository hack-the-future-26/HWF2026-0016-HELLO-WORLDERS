import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  registerOrLogin: (name: string, email: string, college: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => authService.getCurrentUser());

  useEffect(() => { setUser(authService.getCurrentUser()); }, []);

  const registerOrLogin = async (name: string, email: string, college: string) => {
    const u = await authService.registerOrLogin(name, email, college);
    setUser(u);
  };

  const logout = () => { authService.logout(); setUser(null); };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, registerOrLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
