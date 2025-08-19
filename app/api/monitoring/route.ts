import { NextRequest, NextResponse } from 'next/server'
import { monitoringService } from '@/utils/monitoringService'
import { telegramService } from '@/utils/telegramService'
import { translateService } from '@/lib/translate'
import { authenticateRequest as _authenticateRequest, isAdmin as _isAdmin } from '@/lib/auth'
import { strictRateLimit } from '@/lib/rateLimit'
import { strictCors, applyCorsHeaders as _applyCorsHeaders } from '@/lib/cors'
import { createSecureResponse as _createSecureResponse, logSecurityEvent } from '@/lib/security'

export async function GET(request: NextRequest) {
  try {
    // Применяем CORS
    const corsHeaders = strictCors(request)
    if (corsHeaders instanceof NextResponse) {
      return corsHeaders
    }

    // Применяем rate limiting
    const rateLimitResult = strictRateLimit(request)
    if (rateLimitResult) {
      return rateLimitResult
    }

    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    // Логируем доступ к мониторингу
    logSecurityEvent('Monitoring accessed', {
      ip: request.ip || 'unknown',
      timestamp: new Date().toISOString()
    }, 'info')

    switch (action) {
      case 'stats':
        return NextResponse.json({
          success: true,
          data: monitoringService.getSystemStats()
        })

      case 'metrics':
        return NextResponse.json({
          success: true,
          data: monitoringService.getAllMetrics()
        })

      case 'logs':
        const level = searchParams.get('level') as string | null
        const limit = parseInt(searchParams.get('limit') || '50')
        // Проверяем, что level является допустимым значением
        const validLevel = level && ['error', 'info', 'warn', 'debug'].includes(level) ? level as 'error' | 'info' | 'warn' | 'debug' : undefined
        return NextResponse.json({
          success: true,
          data: monitoringService.getLogs(validLevel, limit)
        })

      case 'health':
        const telegramHealth = await telegramService.checkHealth()
        const translateHealth = await translateService.checkApiHealth()
        
        return NextResponse.json({
          success: true,
          data: {
            telegram: telegramHealth,
            translate: translateHealth,
            system: true
          }
        })

      case 'report':
        const report = monitoringService.generatePerformanceReport()
        return NextResponse.json({
          success: true,
          data: report
        })

      default:
        return NextResponse.json({
          success: true,
          data: {
            stats: monitoringService.getSystemStats(),
            metrics: monitoringService.getAllMetrics(),
            logs: monitoringService.getLogs(undefined, 10)
          }
        })
    }
  } catch (error) {
    // Логируем ошибку безопасности
    logSecurityEvent('Monitoring access error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      ip: request.ip || 'unknown',
      timestamp: new Date().toISOString()
    }, 'error')

    const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка'
    monitoringService.error('Ошибка в API мониторинга', 'monitoring-api', { error: errorMessage })
    
    return NextResponse.json({
      success: false,
      error: 'Внутренняя ошибка сервера'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data: _data } = body

    switch (action) {
      case 'clear-logs':
        monitoringService.clearLogs()
        return NextResponse.json({
          success: true,
          message: 'Логи очищены'
        })

      case 'clear-metrics':
        monitoringService.clearMetrics()
        return NextResponse.json({
          success: true,
          message: 'Метрики очищены'
        })

      case 'send-report':
        const report = monitoringService.generatePerformanceReport()
        const sent = await telegramService.sendTranslationStats({
          totalKeys: report.details.metrics.translation_keys || 0,
          totalLanguages: report.details.metrics.languages || 0,
          lastUpdate: new Date().toLocaleString('ru-RU'),
          cacheSize: report.details.metrics.cache_size || 0
        })

        return NextResponse.json({
          success: true,
          message: sent ? 'Отчет отправлен в Telegram' : 'Ошибка отправки отчета'
        })

      case 'test-notification':
        const testSent = await telegramService.sendMessage({
          text: '🧪 Тестовое уведомление от системы мониторинга переводов',
          parse_mode: 'HTML'
        })

        return NextResponse.json({
          success: true,
          message: testSent ? 'Тестовое уведомление отправлено' : 'Ошибка отправки уведомления'
        })

      default:
        return NextResponse.json({
          success: false,
          error: 'Неизвестное действие'
        }, { status: 400 })
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка'
    monitoringService.error('Ошибка в POST API мониторинга', 'monitoring-api', { error: errorMessage })
    
    return NextResponse.json({
      success: false,
      error: 'Внутренняя ошибка сервера'
    }, { status: 500 })
  }
} 