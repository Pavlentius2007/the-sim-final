import { NextRequest, NextResponse } from 'next/server'
import { createRateLimit, rateLimitConfigs } from './rateLimit'
import { validateInput as _validateInput, validationSchemas as _validationSchemas } from './security'
import { strictCors } from './cors'
import { withCSRFProtection } from './csrf'

// Wrapper для публичных API routes
export async function withPublicSecurity(
  request: NextRequest,
  handler: (_request: NextRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    // Применяем CORS
    const corsResult = strictCors(request)
    if (corsResult instanceof NextResponse) {
      return corsResult
    }

    // Проверяем rate limiting - используем разные конфигурации для разных API
    let rateLimitConfig = rateLimitConfigs.public
    if (request.nextUrl.pathname === '/api/auth') {
      rateLimitConfig = rateLimitConfigs.auth
    } else if (request.nextUrl.pathname === '/api/leads') {
      rateLimitConfig = rateLimitConfigs.public
    }
    
    const rateLimitResult = createRateLimit(rateLimitConfig)(request)
    if (rateLimitResult instanceof NextResponse) {
      return rateLimitResult
    }

    // Применяем CSRF защиту
    return await withCSRFProtection(request, async (req) => {
      // Вызываем основной обработчик
      const response = await handler(req)
      
      // Применяем CORS заголовки к ответу
      Object.entries(corsResult).forEach(([key, value]) => {
        response.headers.set(key, value)
      })

      return response
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

// Wrapper для защищенных API routes (требует аутентификации)
export async function withAuthSecurity(
  request: NextRequest,
  handler: (_request: NextRequest, user: any) => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    // Применяем CORS
    const corsResult = strictCors(request)
    if (corsResult instanceof NextResponse) {
      return corsResult
    }

    // Проверяем rate limiting
    const rateLimitResult = createRateLimit(rateLimitConfigs.strict)(request)
    if (rateLimitResult instanceof NextResponse) {
      return rateLimitResult
    }

    // Проверяем аутентификацию
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Проверяем JWT токен
    if (token.length < 10) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    // Применяем CSRF защиту
    return await withCSRFProtection(request, async (req) => {
      // Вызываем основной обработчик
      const response = await handler(req, { token })
      
      // Применяем CORS заголовки к ответу
      Object.entries(corsResult).forEach(([key, value]) => {
        response.headers.set(key, value)
      })

      return response
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

// Wrapper для API routes с валидацией входных данных
export async function withValidation(
  request: NextRequest,
  schema: Record<string, any>,
  handler: (_request: NextRequest, validatedData: any) => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    // Парсим тело запроса
    const body = await request.json().catch(() => ({}))
    
    // Валидируем данные
    const validation = _validateInput(body, schema)
    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      )
    }

    // Вызываем основной обработчик
    return await handler(request, body)
  } catch (error) {
    console.error('Validation Error:', error)
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    )
  }
}
