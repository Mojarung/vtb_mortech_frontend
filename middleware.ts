import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Проверяем, есть ли токен в куки
  const token = request.cookies.get('access_token')
  
  // Если пользователь на странице аутентификации
  if (pathname.startsWith('/auth/login') || pathname.startsWith('/auth/register')) {
    // Если есть токен, перенаправляем на соответствующий dashboard
    if (token) {
      // В middleware мы не можем проверить валидность токена, 
      // поэтому просто перенаправляем и пусть AuthContext проверит
      return NextResponse.redirect(new URL('/candidate/dashboard', request.url))
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
