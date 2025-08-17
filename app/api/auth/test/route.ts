import { NextRequest, NextResponse } from 'next/server'

// Простой тестовый endpoint для проверки безопасности
export async function GET(request: NextRequest) {
  // Проверяем User-Agent
  const userAgent = request.headers.get('user-agent') || ''
  
  // Блокируем известные сканеры
  if (userAgent.includes('sqlmap') || userAgent.includes('nikto') || userAgent.includes('nmap')) {
    return NextResponse.json(
      { error: 'Access denied' },
      { status: 403 }
    )
  }
  
  // Проверяем подозрительные заголовки
  const suspiciousHeaders = ['x-forwarded-for', 'x-real-ip', 'x-client-ip']
  for (const header of suspiciousHeaders) {
    const headerValue = request.headers.get(header)
    if (headerValue && !headerValue.includes('127.0.0.1') && !headerValue.includes('localhost')) {
      return NextResponse.json(
        { error: 'Suspicious activity detected' },
        { status: 403 }
      )
    }
  }
  
  return NextResponse.json({
    message: 'Security test passed',
    timestamp: new Date().toISOString()
  })
}

export async function POST(request: NextRequest) {
  // Тест POST запроса
  try {
    const body = await request.json()
    
    // Простая валидация
    if (!body.test || typeof body.test !== 'string') {
      return NextResponse.json(
        { error: 'Invalid test data' },
        { status: 400 }
      )
    }
    
    return NextResponse.json({
      message: 'POST test passed',
      received: body.test,
      timestamp: new Date().toISOString()
    })
      } catch {
    return NextResponse.json(
      { error: 'Invalid JSON' },
      { status: 400 }
    )
  }
}
