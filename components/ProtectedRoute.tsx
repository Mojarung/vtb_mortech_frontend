'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'hr' | 'user';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        // Если пользователь не аутентифицирован, перенаправляем на логин
        router.push('/auth/login');
        return;
      }

      if (requiredRole && user?.role !== requiredRole) {
        // Если пользователь не имеет нужной роли, перенаправляем на соответствующий dashboard
        if (user?.role === 'hr') {
          router.push('/hr/dashboard');
        } else {
          router.push('/candidate/dashboard');
        }
        return;
      }
    }
  }, [user, loading, isAuthenticated, requiredRole, router]);

  // Показываем загрузку пока проверяем аутентификацию
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Если пользователь не аутентифицирован или не имеет нужной роли, не показываем контент
  if (!isAuthenticated || (requiredRole && user?.role !== requiredRole)) {
    return null;
  }

  return <>{children}</>;
};
