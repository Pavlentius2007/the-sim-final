import { NextRequest, NextResponse } from 'next/server'

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
  
  // Исключаем статические ресурсы и API из обработки локализации
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/videos/") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml"
  ) {
    return NextResponse.next()
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
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|videos|.*\\..*|api).*)',
  ],
}