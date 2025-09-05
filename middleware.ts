import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Проверяем, есть ли токен в куки
  const token = request.cookies.get('access_token')
  
  // Если пользователь на странице аутентификации и у него есть токен
  if ((pathname.startsWith('/auth/login') || pathname.startsWith('/auth/register')) && token) {
    // Не перенаправляем, пусть AuthContext сам обработает
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
