import { NextRequest, NextResponse } from 'next/server'
import { devCors } from './lib/cors'
import { applySecurityHeaders } from './lib/security'

const locales = ["en", "ru", "zh", "th"]
const defaultLocale = "ru"

function getLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get("accept-language")
  
  if (acceptLanguage) {
    const preferredLocale = acceptLanguage
      .split(",")[0]
      .split("-")[0]
      .toLowerCase()
    
    if (locales.includes(preferredLocale)) {
      return preferredLocale
    }
  }
  
  return defaultLocale
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // ВАЖНО: Исключаем статические ресурсы и видео из обработки локализации
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/videos/") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml"
  ) {
    // Для статических ресурсов все равно применяем CORS и безопасность
    const corsHeaders = devCors(request)
    if (corsHeaders instanceof NextResponse) {
      return applySecurityHeaders(corsHeaders)
    }

    const response = NextResponse.next()
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    
    return applySecurityHeaders(response)
  }
  
  // Проверяем есть ли уже локаль в пути
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  // Если нет локали - добавляем её
  if (!pathnameHasLocale) {
    const locale = getLocale(request)
    const redirectUrl = new URL(`/${locale}${pathname}`, request.url)
    return NextResponse.redirect(redirectUrl)
  }
  
  // Защищаем только админские страницы
  if (pathname.includes('/admin/') && !pathname.includes('/login')) {
    const token = request.cookies.get('auth-token')?.value

    if (!token || token.length < 10) {
      // Определяем текущую локаль для редиректа
      const currentLocale = locales.find(locale => pathname.startsWith(`/${locale}/`)) || defaultLocale
      return NextResponse.redirect(new URL(`/${currentLocale}/admin/login`, request.url))
    }

    // В продакшене проверяем валидность токена
    if (process.env.NODE_ENV === 'production') {
      try {
        const { jwtVerify } = await import('jose')
        const JWT_SECRET = process.env.JWT_SECRET
        
        if (!JWT_SECRET) {
          console.error('JWT_SECRET not configured in production')
          const currentLocale = locales.find(locale => pathname.startsWith(`/${locale}/`)) || defaultLocale
          return NextResponse.redirect(new URL(`/${currentLocale}/admin/login`, request.url))
        }

        await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
      } catch (error) {
        console.error('Invalid JWT token in middleware:', error)
        const currentLocale = locales.find(locale => pathname.startsWith(`/${locale}/`)) || defaultLocale
        return NextResponse.redirect(new URL(`/${currentLocale}/admin/login`, request.url))
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
  
  // Применяем CORS заголовки
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  
  // Применяем заголовки безопасности
  return applySecurityHeaders(response)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|videos|.*\\..*|api).*)',
  ],
}

