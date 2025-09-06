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
  updateUser: (userData: User) => void;
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
      console.log('🔍 AuthContext: Starting auth check...');
      try {
        console.log('🔍 AuthContext: Calling getCurrentUser...');
        const userData = await apiClient.getCurrentUser();
        console.log('✅ AuthContext: User authenticated successfully:', userData);
        setUser(userData);
        
        // Автоматически перенаправляем авторизованного пользователя
        if (typeof window !== 'undefined') {
          const currentPath = window.location.pathname;
          // Если пользователь на странице входа/регистрации, перенаправляем на dashboard
          if (currentPath.startsWith('/auth/')) {
            console.log('🔄 AuthContext: Auto-redirecting authenticated user from auth page');
            // Используем setTimeout чтобы избежать проблем с React
            setTimeout(() => {
              if (userData.role === 'hr') {
                window.location.href = '/hr/dashboard';
              } else {
                window.location.href = '/candidate/dashboard';
              }
            }, 100);
          }
        }
      } catch (error) {
        console.log('❌ AuthContext: User not authenticated:', error);
        console.log('❌ AuthContext: Error details:', {
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined
        });
        setUser(null);
        // HttpOnly cookies нельзя очистить из JavaScript
        // Очистка произойдет автоматически при logout или истечении срока
      } finally {
        console.log('🔍 AuthContext: Setting loading to false');
        setLoading(false);
      }
    };

    checkAuth();
  }, []); // Убираем зависимость, чтобы избежать дублирования

  const login = async (username: string, password: string) => {
    try {
      setLoading(true);
      console.log('🚀 AuthContext: Starting login process...');
      console.log('🚀 AuthContext: Username:', username);
      
      // Проверяем, не авторизован ли уже пользователь
      if (user) {
        console.log('⚠️ AuthContext: User already authenticated, redirecting...');
        if (typeof window !== 'undefined') {
          if (user.role === 'hr') {
            window.location.href = '/hr/dashboard';
          } else {
            window.location.href = '/candidate/dashboard';
          }
        }
        return;
      }
      
      console.log('🚀 AuthContext: Calling apiClient.login...');
      const loginResponse = await apiClient.login({ username, password });
      console.log('✅ AuthContext: Login successful, response:', loginResponse);
      
      console.log('⏳ AuthContext: Waiting for cookies to be set...');
      // Задержка для установки HttpOnly cookies
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('🔍 AuthContext: Calling getCurrentUser...');
      const userData = await apiClient.getCurrentUser();
      console.log('✅ AuthContext: User data received:', userData);
      setUser(userData);
      
      // Перенаправляем на соответствующий dashboard
      if (typeof window !== 'undefined') {
        console.log('🔄 AuthContext: Redirecting to dashboard for role:', userData.role);
        if (userData.role === 'hr') {
          window.location.href = '/hr/dashboard';
        } else {
          window.location.href = '/candidate/dashboard';
        }
      }
    } catch (error) {
      console.error('❌ AuthContext: Login failed:', error);
      console.error('❌ AuthContext: Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    } finally {
      console.log('🔍 AuthContext: Setting loading to false');
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
      
      // Задержка для установки HttpOnly cookies
      await new Promise(resolve => setTimeout(resolve, 500));
      
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

  const logout = async () => {
    try {
      setUser(null);
      await apiClient.logout();
      // Перенаправляем на главную страницу после logout
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Logout failed:', error);
      // Даже если logout не удался, очищаем локальное состояние
      setUser(null);
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    }
  };

  const updateUser = (userData: User) => {
    setUser(userData);
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
