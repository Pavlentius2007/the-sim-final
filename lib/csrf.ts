import { NextRequest, NextResponse } from 'next/server'
import { randomBytes, createHmac } from 'crypto'

// Конфигурация CSRF
const CSRF_SECRET = process.env.CSRF_SECRET

// Проверяем наличие CSRF_SECRET в продакшене
if (!CSRF_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('CSRF_SECRET must be set in production environment')
}

if (CSRF_SECRET && CSRF_SECRET.length < 32) {
  throw new Error('CSRF_SECRET must be at least 32 characters long')
}

// Убеждаемся что CSRF_SECRET определен
if (!CSRF_SECRET) {
  throw new Error('CSRF_SECRET is not configured')
}
const CSRF_TOKEN_LENGTH = 32
const CSRF_TOKEN_EXPIRY = 24 * 60 * 60 * 1000 // 24 часа

// Временно отключаем CSRF для тестирования
const CSRF_ENABLED = process.env.NODE_ENV === 'production'

// Генерируем CSRF токен
export function generateCSRFToken(): string {
  if (!CSRF_SECRET) {
    throw new Error('CSRF_SECRET is not configured')
  }
  
  const randomToken = randomBytes(CSRF_TOKEN_LENGTH).toString('hex')
  const timestamp = Date.now()
  const data = `${randomToken}:${timestamp}`
  
  // Создаем HMAC для подписи токена
  const hmac = createHmac('sha256', CSRF_SECRET)
  hmac.update(data)
  const signature = hmac.digest('hex')
  
  return `${data}:${signature}`
}

// Проверяем CSRF токен
export function validateCSRFToken(token: string): boolean {
  try {
    if (!CSRF_SECRET) {
      return false
    }
    
    const parts = token.split(':')
    if (parts.length !== 3) return false
    
    const [randomToken, timestamp, signature] = parts
    const data = `${randomToken}:${timestamp}`
    
    // Проверяем подпись
    const hmac = createHmac('sha256', CSRF_SECRET)
    hmac.update(data)
    const expectedSignature = hmac.digest('hex')
    
    if (signature !== expectedSignature) return false
    
    // Проверяем срок действия
    const tokenTime = parseInt(timestamp)
    const currentTime = Date.now()
    
    if (currentTime - tokenTime > CSRF_TOKEN_EXPIRY) return false
    
    return true
  } catch {
    return false
  }
}

// Middleware для проверки CSRF токена в API запросах
export async function withCSRFProtection(
  request: NextRequest,
  handler: (request: NextRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  // Пропускаем GET запросы
  if (request.method === 'GET') {
    return handler(request)
  }
  
  // Временно отключаем CSRF для тестирования
  if (!CSRF_ENABLED) {
    return handler(request)
  }
  
  // Проверяем CSRF токен для POST/PUT/DELETE запросов
  const csrfToken = request.headers.get('x-csrf-token') || 
                   request.headers.get('csrf-token') ||
                   request.nextUrl.searchParams.get('csrf_token')
  
  if (!csrfToken || !validateCSRFToken(csrfToken)) {
    return NextResponse.json(
      { error: 'Invalid or missing CSRF token' },
      { status: 403 }
    )
  }
  
  return handler(request)
}

// Функция для добавления CSRF токена в HTML формы
export function injectCSRFToken(html: string): string {
  const csrfToken = generateCSRFToken()
  
  // Добавляем скрытое поле CSRF в формы
  const formRegex = /<form([^>]*)>/gi
  const csrfField = `<input type="hidden" name="csrf_token" value="${csrfToken}" />`
  
  return html.replace(formRegex, (match, attributes) => {
    return `<form${attributes}>${csrfField}`
  })
}

// Функция для получения CSRF токена для клиентской стороны
export function getCSRFToken(): string {
  return generateCSRFToken()
}
