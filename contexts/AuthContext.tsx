'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { apiClient, User } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (userData: {
    username: string;
    email: string;
    password: string;
    role: 'hr' | 'user';
    full_name?: string;
  }) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  // Проверяем аутентификацию при загрузке приложения
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await apiClient.getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.log('User not authenticated');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      setLoading(true);
      console.log('Starting login process...');
      
      await apiClient.login({ username, password });
      console.log('Login successful, getting user data...');
      
      // Небольшая задержка, чтобы куки успели установиться
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const userData = await apiClient.getCurrentUser();
      console.log('User data received:', userData);
      setUser(userData);
      
      // Перенаправляем на соответствующий dashboard
      if (typeof window !== 'undefined') {
        console.log('Redirecting to dashboard for role:', userData.role);
        if (userData.role === 'hr') {
          window.location.href = '/hr/dashboard';
        } else {
          window.location.href = '/candidate/dashboard';
        }
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: {
    username: string;
    email: string;
    password: string;
    role: 'hr' | 'user';
    full_name?: string;
  }) => {
    try {
      setLoading(true);
      await apiClient.register(userData);
      // После регистрации автоматически логинимся
      await apiClient.login({ username: userData.username, password: userData.password });
      
      // Небольшая задержка, чтобы куки успели установиться
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const currentUser = await apiClient.getCurrentUser();
      setUser(currentUser);
      
      // Перенаправляем на соответствующий dashboard
      if (typeof window !== 'undefined') {
        if (currentUser.role === 'hr') {
          window.location.href = '/hr/dashboard';
        } else {
          window.location.href = '/candidate/dashboard';
        }
      }
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    apiClient.logout();
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
