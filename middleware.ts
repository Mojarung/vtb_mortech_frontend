import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Проверяем, есть ли токен в куки
  const token = request.cookies.get('access_token')
  
  // Разрешаем доступ к главной странице и другим публичным страницам
  if (pathname === '/' || pathname.startsWith('/public/') || pathname.startsWith('/_next/') || pathname.startsWith('/api/')) {
    return NextResponse.next()
  }
  
  // Если пользователь на странице аутентификации
  if (pathname.startsWith('/auth/login') || pathname.startsWith('/auth/register')) {
    // Если есть токен, перенаправляем на главную страницу
    // AuthContext сам определит, куда перенаправить пользователя
    if (token) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
  }
  
  // Если пользователь пытается зайти на защищенные страницы без токена
  if ((pathname.startsWith('/candidate/') || pathname.startsWith('/hr/')) && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/auth/:path*',
    '/candidate/:path*',
    '/hr/:path*'
  ]
}
