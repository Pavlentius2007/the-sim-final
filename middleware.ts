import { NextRequest, NextResponse } from 'next/server'
import { devCors } from './lib/cors'
import { applySecurityHeaders } from './lib/security'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Защищаем только админские страницы
  if (pathname.startsWith('/admin/') && !pathname.includes('/login')) {
    const token = request.cookies.get('auth-token')?.value

    if (!token || token.length < 10) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // В продакшене проверяем валидность токена
    if (process.env.NODE_ENV === 'production') {
      try {
        // Проверяем JWT токен
        const { jwtVerify } = await import('jose')
        const JWT_SECRET = process.env.JWT_SECRET
        
        if (!JWT_SECRET) {
          console.error('JWT_SECRET not configured in production')
          return NextResponse.redirect(new URL('/admin/login', request.url))
        }

        await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
      } catch (error) {
        console.error('Invalid JWT token in middleware:', error)
        return NextResponse.redirect(new URL('/admin/login', request.url))
      }
    }
  }

  // Применяем CORS заголовки ко всем запросам
  const corsHeaders = devCors(request)
  if (corsHeaders instanceof NextResponse) {
    return applySecurityHeaders(corsHeaders)
  }

  // Для всех остальных запросов применяем заголовки и продолжаем
  const response = NextResponse.next()
  
  // Применяем CORS заголовки (даже если Origin отсутствует)
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  
  // Применяем заголовки безопасности
  return applySecurityHeaders(response)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)',
  ],
}

