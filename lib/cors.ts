import { NextRequest, NextResponse } from 'next/server'

interface CorsConfig {
  allowedOrigins: string[]
  allowedMethods: string[]
  allowedHeaders: string[]
  credentials: boolean
  maxAge: number
}

// Конфигурация CORS по умолчанию
const defaultCorsConfig: CorsConfig = {
  allowedOrigins: [
    'http://localhost:3000',
    'https://thesim.in',
    'https://www.thesim.in'
  ],
  allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  credentials: true,
  maxAge: 86400 // 24 часа
}

// Функция для создания CORS middleware
export function createCorsMiddleware(config: Partial<CorsConfig> = {}) {
  const corsConfig = { ...defaultCorsConfig, ...config }
  
  return function corsMiddleware(request: NextRequest) {
    const origin = request.headers.get('origin')
    const method = request.method
    
    // Проверяем, разрешен ли origin
    const isOriginAllowed = !origin || corsConfig.allowedOrigins.includes(origin)
    
    // Создаем заголовки CORS
    const corsHeaders: Record<string, string> = {}
    
    // Добавляем CORS заголовки для всех запросов
    if (isOriginAllowed && origin) {
      corsHeaders['Access-Control-Allow-Origin'] = origin
    } else if (isOriginAllowed) {
      // Если Origin отсутствует, добавляем заголовки для same-origin запросов
      corsHeaders['Access-Control-Allow-Origin'] = 'null'
    }
    
    corsHeaders['Access-Control-Allow-Methods'] = corsConfig.allowedMethods.join(', ')
    corsHeaders['Access-Control-Allow-Headers'] = corsConfig.allowedHeaders.join(', ')
    corsHeaders['Access-Control-Max-Age'] = corsConfig.maxAge.toString()
    
    if (corsConfig.credentials) {
      corsHeaders['Access-Control-Allow-Credentials'] = 'true'
    }
    
    // Добавляем заголовки безопасности
    corsHeaders['X-Content-Type-Options'] = 'nosniff'
    corsHeaders['X-Frame-Options'] = 'DENY'
    corsHeaders['X-XSS-Protection'] = '1; mode=block'
    corsHeaders['Referrer-Policy'] = 'strict-origin-when-cross-origin'
    
    // Обработка preflight запроса
    if (method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 200,
        headers: corsHeaders
      })
    }
    
    // Для обычных запросов возвращаем заголовки для добавления к ответу
    return corsHeaders
  }
}

// Готовые CORS middleware для разных сценариев
export const strictCors = createCorsMiddleware({
  allowedOrigins: ['https://thesim.in', 'https://www.thesim.in'],
  allowedMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
})

export const publicCors = createCorsMiddleware({
  allowedOrigins: ['*'],
  allowedMethods: ['GET', 'POST'],
  credentials: false
})

export const devCors = createCorsMiddleware({
  allowedOrigins: ['http://localhost:3000', 'https://thesim.in'],
  allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
})

// Функция для применения CORS заголовков к ответу
export function applyCorsHeaders(response: NextResponse, corsHeaders: Record<string, string>): NextResponse {
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  return response
}
