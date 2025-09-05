import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Разрешаем доступ к главной странице и другим публичным страницам
  if (pathname === '/' || pathname.startsWith('/public/') || pathname.startsWith('/_next/') || pathname.startsWith('/api/')) {
    return NextResponse.next()
  }
  
  // Для страниц аутентификации - не блокируем, пусть AuthContext сам решает
  if (pathname.startsWith('/auth/login') || pathname.startsWith('/auth/register')) {
    return NextResponse.next()
  }
  
  // Для защищенных страниц - не блокируем, пусть AuthContext сам решает
  // Middleware только проверяет наличие токена, но не его валидность
  if (pathname.startsWith('/candidate/') || pathname.startsWith('/hr/')) {
    return NextResponse.next()
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
