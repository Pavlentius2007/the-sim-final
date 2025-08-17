import { NextRequest, NextResponse } from 'next/server'

// Простой in-memory store для rate limiting
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

interface RateLimitConfig {
  windowMs: number
  maxRequests: number
  message?: string
  statusCode?: number
}

// Функция для очистки устаревших записей
function cleanupExpiredEntries() {
  const now = Date.now()
  rateLimitStore.forEach((value, key) => {
    if (now > value.resetTime) {
      rateLimitStore.delete(key)
    }
  })
}

// Функция для сброса всех счетчиков (для тестирования)
export function resetRateLimitCounters() {
  rateLimitStore.clear()
  console.warn('🧹 Rate Limit: Все счетчики сброшены')
}

// Основная функция rate limiting
export function createRateLimit(config: RateLimitConfig) {
  return function rateLimitMiddleware(request: NextRequest) {
    // Очищаем устаревшие записи каждые 100 запросов
    if (Math.random() < 0.01) {
      cleanupExpiredEntries()
    }

    const ip = request.ip || 'unknown'
    const key = `${ip}:${request.nextUrl.pathname}`
    const now = Date.now()

    // Отладочная информация
    // console.log(`🔍 Rate Limit Debug: IP=${ip}, Key=${key}, Path=${request.nextUrl.pathname}`)

    // Получаем текущие данные для IP
    const current = rateLimitStore.get(key)
    
    if (!current || now > current.resetTime) {
      // Создаем новую запись
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + config.windowMs
      })
      // console.log(`✅ Rate Limit: Создана новая запись для ${key}, count=1`)
      return null // Продолжаем выполнение
    }

    // Проверяем лимит
    if (current.count >= config.maxRequests) {
      const retryAfter = Math.ceil((current.resetTime - now) / 1000)
      console.warn(`🚫 Rate Limit: Превышен лимит для ${key}, count=${current.count}, max=${config.maxRequests}`)
      
      return NextResponse.json(
        {
          error: 'Too Many Requests',
          message: config.message || 'Слишком много запросов',
          retryAfter,
          limit: config.maxRequests,
          windowMs: config.windowMs
        },
        {
          status: config.statusCode || 429,
          headers: {
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': config.maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(current.resetTime).toISOString()
          }
        }
      )
    }

    // Увеличиваем счетчик
    current.count++
    rateLimitStore.set(key, current)
    // console.log(`📈 Rate Limit: Увеличен счетчик для ${key}, count=${current.count}`)
    
    return null // Продолжаем выполнение
  }
}

// Предустановленные конфигурации
export const rateLimitConfigs = {
  // Строгий лимит для API
  strict: {
    windowMs: 15 * 60 * 1000, // 15 минут
    maxRequests: 100,
    message: 'Превышен лимит запросов к API'
  },
  
  // Умеренный лимит для аутентификации
  auth: {
    windowMs: 15 * 60 * 1000, // 15 минут
    maxRequests: 5,
    message: 'Слишком много попыток входа'
  },
  
  // Либеральный лимит для публичных страниц
  public: {
    windowMs: 15 * 60 * 1000, // 15 минут
    maxRequests: 300,
    message: 'Превышен лимит запросов'
  }
}

// Экспортируем готовые middleware
export const authRateLimit = createRateLimit(rateLimitConfigs.auth)
export const strictRateLimit = createRateLimit(rateLimitConfigs.strict)
export const publicRateLimit = createRateLimit(rateLimitConfigs.public)
