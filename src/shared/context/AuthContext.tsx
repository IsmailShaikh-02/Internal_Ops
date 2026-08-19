import React, { createContext, useContext, useState, useCallback } from 'react';
import type { PlatformUser, PlatformPermission } from '../types/auth.types';
import { MOCK_USERS } from '../constants/mockUsers';

interface AuthContextType {
  user: PlatformUser | null;
  isAuthenticated: boolean;
  login: (user: PlatformUser) => void;
  logout: () => void;
  hasPermission: (permission: PlatformPermission) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'internalops_auth_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<PlatformUser | null>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      // Automatic fallback to MOCK_USERS.owner during development if empty
      const isDev = import.meta.env.DEV;
      if (isDev) {
        return MOCK_USERS.owner;
      }
    } catch (e) {
      console.error('Failed to restore auth user from localStorage:', e);
    }
    return null;
  });

  const login = useCallback((newUser: PlatformUser) => {
    const userWithTime = {
      ...newUser,
      lastLoginAt: new Date().toISOString(),
    };
    setUser(userWithTime);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userWithTime));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }, []);

  const hasPermission = useCallback(
    (permission: PlatformPermission): boolean => {
      if (!user) return false;
      // If user has wildcard '*', they have all permissions
      if (user.permissions.includes('*')) return true;
      return user.permissions.includes(permission);
    },
    [user]
  );

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
