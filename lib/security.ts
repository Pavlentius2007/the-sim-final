import { NextRequest, NextResponse } from 'next/server'

// Заголовки безопасности для защиты от различных атак
export const securityHeaders = {
  // Защита от XSS атак
  'X-XSS-Protection': '1; mode=block',
  
  // Защита от MIME type sniffing
  'X-Content-Type-Options': 'nosniff',
  
  // Защита от clickjacking
  'X-Frame-Options': 'DENY',
  
  // Политика реферера
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Content Security Policy (минимальная)
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https: blob:",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self'",
    "media-src 'self'",
    "object-src 'none'"
  ].join('; '),
  
  // Защита от MIME type confusion
  'X-Download-Options': 'noopen',
  
  // Защита от IE автоматического выполнения
  'X-DO-Content-Type-Options': 'nosniff',
  
  // Защита от переполнения буфера
  'X-Permitted-Cross-Domain-Policies': 'none',
  
  // Strict Transport Security (только для HTTPS)
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  
  // Защита от DNS prefetch
  'X-DNS-Prefetch-Control': 'off',
  
  // Защита от cache poisoning
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0'
}

// Функция для применения заголовков безопасности
export function applySecurityHeaders(response: NextResponse): NextResponse {
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  return response
}

// Функция для создания безопасного ответа
export function createSecureResponse(data: unknown, status: number = 200): NextResponse {
  const response = NextResponse.json(data, { status })
  return applySecurityHeaders(response)
}

// Функция для валидации входных данных
export function validateInput(
  data: Record<string, unknown>, 
  schema: Record<string, {
    required?: boolean
    type?: 'string' | 'number' | 'email' | 'phone'
    minLength?: number
    maxLength?: number
    min?: number
    max?: number
    security?: boolean
  }>
): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field]
    
    // Проверка обязательности
    if (rules.required && (value === undefined || value === null || value === '')) {
      errors.push(`Поле ${field} обязательно для заполнения`)
      continue
    }
    
    // Проверка типа
    if (rules.type && value !== undefined && value !== null) {
      if (rules.type === 'string' && typeof value !== 'string') {
        errors.push(`Поле ${field} должно быть строкой`)
      } else if (rules.type === 'number' && typeof value !== 'number') {
        errors.push(`Поле ${field} должно быть числом`)
      } else if (rules.type === 'email' && typeof value === 'string' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errors.push(`Поле ${field} должно быть корректным email`)
      } else if (rules.type === 'phone' && typeof value === 'string' && !/^[\+]?[0-9\s\-\(\)]+$/.test(value)) {
        errors.push(`Поле ${field} должно быть корректным номером телефона`)
      }
    }
    
    // Проверка длины
    if (rules.minLength && value && typeof value === 'string' && value.length < rules.minLength) {
      errors.push(`Поле ${field} должно содержать минимум ${rules.minLength} символов`)
    }
    
    if (rules.maxLength && value && typeof value === 'string' && value.length > rules.maxLength) {
      errors.push(`Поле ${field} должно содержать максимум ${rules.maxLength} символов`)
    }
    
    // Проверка диапазона для чисел
    if (rules.min && typeof value === 'number' && value < rules.min) {
      errors.push(`Поле ${field} должно быть не меньше ${rules.min}`)
    }
    
    if (rules.max && typeof value === 'number' && value > rules.max) {
      errors.push(`Поле ${field} должно быть не больше ${rules.max}`)
    }
    
    // Дополнительные проверки безопасности для строковых полей
    if (typeof value === 'string' && rules.security !== false) {
      // Проверка на SQL Injection
      const sqlPatterns = [
        /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute|script)\b)/i,
        /(['";])/,
        /(--)/,
        /(\/\*)/,
        /(\*\/)/,
        /(xp_cmdshell)/i,
        /(sp_)/i
      ]
      
      for (const pattern of sqlPatterns) {
        if (pattern.test(value)) {
          errors.push(`Поле ${field} содержит недопустимые символы`)
          break
        }
      }
      
      // Проверка на XSS
      const xssPatterns = [
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        /javascript:/i,
        /on\w+\s*=/i,
        /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
        /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
        /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi
      ]
      
      for (const pattern of xssPatterns) {
        if (pattern.test(value)) {
          errors.push(`Поле ${field} содержит недопустимые символы`)
          break
        }
      }
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Схемы валидации для разных типов данных
export const validationSchemas: Record<string, Record<string, {
  required?: boolean
  type?: 'string' | 'number' | 'email' | 'phone'
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  security?: boolean
}>> = {
  lead: {
    name: { required: true, type: 'string', minLength: 2, maxLength: 100, security: true },
    email: { required: true, type: 'email', maxLength: 255, security: true },
    phone: { required: true, type: 'phone', maxLength: 20, security: true },
    telegram: { required: false, type: 'string', maxLength: 50, security: true },
    message: { required: false, type: 'string', maxLength: 1000, security: true },
    source: { required: false, type: 'string', maxLength: 100, security: true }
  },
  
  user: {
    username: { required: true, type: 'string', minLength: 3, maxLength: 50 },
    email: { required: true, type: 'email', maxLength: 255 },
    password: { required: true, type: 'string', minLength: 8, maxLength: 100 }
  },
  
  login: {
    username: { required: true, type: 'string', minLength: 1, maxLength: 100 },
    password: { required: true, type: 'string', minLength: 1, maxLength: 100 }
  }
}

// Функция для логирования безопасности
export function logSecurityEvent(event: string, details: unknown, level: 'info' | 'warn' | 'error' = 'info') {
  const timestamp = new Date().toISOString()
  const logEntry = {
    timestamp,
    level,
    event,
    details,
    ip: 'unknown', // В реальном проекте получать из request
    userAgent: 'unknown' // В реальном проекте получать из request
  }
  
  // В реальном проекте отправлять в систему логирования
  console.warn(`[SECURITY ${level.toUpperCase()}] ${timestamp}: ${event}`, logEntry)
  
  // Для критических событий можно отправлять уведомления
  if (level === 'error') {
    // sendSecurityAlert(logEntry)
  }
}

// Функция для проверки подозрительной активности
export function detectSuspiciousActivity(request: NextRequest): { isSuspicious: boolean; reason?: string } {
  const userAgent = request.headers.get('user-agent') || ''
  const _ip = request.ip || 'unknown'
  
  // Логируем для отладки
  // console.log('🔍 Security check - User-Agent:', userAgent)
  // console.log('🔍 Security check - IP:', ip)
  // console.log('🔍 Security check - NODE_ENV:', process.env.NODE_ENV)
  
  // Проверка подозрительного User-Agent (только явно вредоносные)
  if (userAgent.includes('sqlmap') || userAgent.includes('nikto') || userAgent.includes('nmap')) {
    return { isSuspicious: true, reason: 'Malicious scanning tool detected' }
  }
  
  // Проверка пустого User-Agent
  if (!userAgent || userAgent.trim() === '') {
    return { isSuspicious: true, reason: 'Empty User-Agent' }
  }
  
  // Проверка подозрительных заголовков (только явно вредоносные)
  const suspiciousHeaders = ['x-forwarded-for', 'x-real-ip', 'x-client-ip']
  for (const header of suspiciousHeaders) {
    const headerValue = request.headers.get(header)
          if (headerValue) {
        // console.log(`🔍 Security check - Header ${header}:`, headerValue)
        
        // Не блокируем локальные запросы и заголовки при разработке
        if (headerValue === '::1' || headerValue === '127.0.0.1' || headerValue === 'localhost' || 
            headerValue.includes('127.0.0.1') || headerValue.includes('localhost') ||
            process.env.NODE_ENV === 'development') {
          // console.log(`✅ Header ${header} allowed (local/development)`)
          continue
        }
        
        // console.log(`🚨 Header ${header} blocked as suspicious`)
        return { isSuspicious: true, reason: `Suspicious header: ${header}` }
      }
  }
  
  // console.log('✅ Security check passed - no suspicious activity detected')
  return { isSuspicious: false }
}
