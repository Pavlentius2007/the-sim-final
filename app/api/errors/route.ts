import { NextRequest, NextResponse } from 'next/server'

// Интерфейс для логирования ошибок
interface ErrorLog {
  id: string
  type: string
  message: string
  details?: string
  code?: string | number
  field?: string
  timestamp: string
  context?: Record<string, unknown>
  userAgent?: string
  url?: string
  userId?: string
  sessionId?: string
}

// Mock хранилище ошибок (в реальном проекте это будет БД)
let errorLogs: ErrorLog[] = []

// POST - логирование новой ошибки
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const userAgent = request.headers.get('user-agent') || 'Unknown'
    const referer = request.headers.get('referer') || 'Unknown'
    
    // Создаем запись об ошибке
    const errorLog: ErrorLog = {
      id: Date.now().toString(),
      type: body.type || 'UNKNOWN',
      message: body.message || 'No message provided',
      details: body.details,
      code: body.code,
      field: body.field,
      timestamp: body.timestamp || new Date().toISOString(),
      context: body.context,
      userAgent,
      url: referer,
      userId: body.userId,
      sessionId: body.sessionId
    }
    
    // Сохраняем в хранилище
    errorLogs.unshift(errorLog)
    
    // Ограничиваем размер лога
    if (errorLogs.length > 1000) {
      errorLogs = errorLogs.slice(0, 1000)
    }
    
    // В продакшене здесь можно отправлять в внешние сервисы
    if (process.env.NODE_ENV === 'production') {
      // Отправка в Sentry, LogRocket, DataDog и т.д.
      await sendToExternalService(errorLog)
    }
    
    // Критические ошибки могут отправляться в Telegram
    if (isCriticalError(errorLog)) {
      await sendCriticalErrorNotification(errorLog)
    }
    
    return NextResponse.json({
      success: true,
      id: errorLog.id,
      message: 'Error logged successfully'
    })
    
  } catch (error) {
    console.error('Failed to log error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to log error' },
      { status: 500 }
    )
  }
}

// GET - получение логов ошибок (для админки)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const type = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '50')
    const page = parseInt(searchParams.get('page') || '1')
    const severity = searchParams.get('severity') // 'critical', 'high', 'medium', 'low'
    const timeRange = searchParams.get('timeRange') // '1h', '24h', '7d', '30d'
    
    let filteredLogs = [...errorLogs]
    
    // Фильтрация по типу
    if (type) {
      filteredLogs = filteredLogs.filter(log => log.type === type)
    }
    
    // Фильтрация по временному диапазону
    if (timeRange) {
      const now = new Date()
      let cutoff: Date
      
      switch (timeRange) {
        case '1h':
          cutoff = new Date(now.getTime() - 60 * 60 * 1000)
          break
        case '24h':
          cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000)
          break
        case '7d':
          cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case '30d':
          cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          break
        default:
          cutoff = new Date(0)
      }
      
      filteredLogs = filteredLogs.filter(log => 
        new Date(log.timestamp) > cutoff
      )
    }
    
    // Фильтрация по критичности
    if (severity) {
      filteredLogs = filteredLogs.filter(log => 
        getErrorSeverity(log) === severity
      )
    }
    
    // Пагинация
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedLogs = filteredLogs.slice(startIndex, endIndex)
    
    // Статистика
    const stats = {
      total: filteredLogs.length,
      byType: getErrorStatsByType(filteredLogs),
      bySeverity: getErrorStatsBySeverity(filteredLogs),
      recentTrends: getRecentTrends(filteredLogs)
    }
    
    return NextResponse.json({
      success: true,
      data: paginatedLogs,
      pagination: {
        page,
        limit,
        total: filteredLogs.length,
        pages: Math.ceil(filteredLogs.length / limit)
      },
      stats,
      message: 'Error logs fetched successfully'
    })
    
  } catch (error) {
    console.error('Failed to fetch error logs:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch error logs' },
      { status: 500 }
    )
  }
}

// DELETE - очистка логов
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') || '7d'
    const type = searchParams.get('type')
    
    let deletedCount = 0
    
    if (type) {
      // Удаление по типу
      const originalLength = errorLogs.length
      errorLogs = errorLogs.filter(log => log.type !== type)
      deletedCount = originalLength - errorLogs.length
    } else {
      // Удаление по времени
      const now = new Date()
      let cutoff: Date
      
      switch (timeRange) {
        case '1h':
          cutoff = new Date(now.getTime() - 60 * 60 * 1000)
          break
        case '24h':
          cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000)
          break
        case '7d':
          cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case '30d':
          cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          break
        default:
          cutoff = new Date(0) // Удалить все
      }
      
      const originalLength = errorLogs.length
      errorLogs = errorLogs.filter(log => 
        new Date(log.timestamp) > cutoff
      )
      deletedCount = originalLength - errorLogs.length
    }
    
    return NextResponse.json({
      success: true,
      deletedCount,
      remaining: errorLogs.length,
      message: `${deletedCount} error logs deleted`
    })
    
  } catch (error) {
    console.error('Failed to delete error logs:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete error logs' },
      { status: 500 }
    )
  }
}

// Вспомогательные функции

function isCriticalError(errorLog: ErrorLog): boolean {
  const criticalTypes = ['SERVER', 'AUTHENTICATION']
  const criticalCodes = [500, 503, 504]
  const criticalKeywords = ['database', 'payment', 'security', 'breach']
  
  return (
    criticalTypes.includes(errorLog.type) ||
    (typeof errorLog.code === 'number' && criticalCodes.includes(errorLog.code)) ||
    criticalKeywords.some(keyword => 
      errorLog.message.toLowerCase().includes(keyword) ||
      errorLog.details?.toLowerCase().includes(keyword)
    )
  )
}

function getErrorSeverity(errorLog: ErrorLog): string {
  if (isCriticalError(errorLog)) return 'critical'
  if (errorLog.type === 'NETWORK' || errorLog.code === 404) return 'low'
  if (errorLog.type === 'VALIDATION') return 'medium'
  return 'high'
}

function getErrorStatsByType(logs: ErrorLog[]) {
  const stats: Record<string, number> = {}
  logs.forEach(log => {
    stats[log.type] = (stats[log.type] || 0) + 1
  })
  return stats
}

function getErrorStatsBySeverity(logs: ErrorLog[]) {
  const stats = { critical: 0, high: 0, medium: 0, low: 0 }
  logs.forEach(log => {
    const severity = getErrorSeverity(log)
    stats[severity as keyof typeof stats]++
  })
  return stats
}

function getRecentTrends(logs: ErrorLog[]) {
  const now = new Date()
  const hours = Array.from({ length: 24 }, (_, i) => {
    const hour = new Date(now.getTime() - i * 60 * 60 * 1000)
    const count = logs.filter(log => {
      const logTime = new Date(log.timestamp)
      return logTime >= new Date(hour.getTime() - 60 * 60 * 1000) && logTime < hour
    }).length
    
    return {
      hour: hour.getHours(),
      count
    }
  }).reverse()
  
  return hours
}

async function sendToExternalService(errorLog: ErrorLog): Promise<void> {
  // Интеграция с внешними сервисами мониторинга
  // Sentry, LogRocket, DataDog и т.д.
  try {
    // Пример отправки в webhook
    if (process.env.ERROR_LOGGING_WEBHOOK) {
      await fetch(process.env.ERROR_LOGGING_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorLog)
      })
    }
  } catch (error) {
    console.error('Failed to send to external service:', error)
  }
}

async function sendCriticalErrorNotification(errorLog: ErrorLog): Promise<void> {
  // Отправка критических ошибок в Telegram
  try {
    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
      const message = `🚨 *Критическая ошибка в The SIM*\n\n` +
        `*Тип:* ${errorLog.type}\n` +
        `*Сообщение:* ${errorLog.message}\n` +
        `*Время:* ${new Date(errorLog.timestamp).toLocaleString('ru-RU')}\n` +
        `*URL:* ${errorLog.url || 'Unknown'}\n` +
        `${errorLog.details ? `*Детали:* ${errorLog.details}` : ''}`
      
      await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'Markdown'
        })
      })
    }
  } catch (error) {
    console.error('Failed to send critical error notification:', error)
  }
}









