import { NextRequest, NextResponse } from 'next/server'
import { translationManager } from '@/utils/translationManager'
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

    const stats = await translationManager.getTranslationStats()
    
    // Логируем доступ к переводам
    logSecurityEvent('Translations accessed', {
      ip: request.ip || 'unknown',
      timestamp: new Date().toISOString()
    }, 'info')

    return NextResponse.json({
      success: true,
      data: stats
    })
  } catch (error) {
    // Логируем ошибку безопасности
    logSecurityEvent('Translations access error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      ip: request.ip || 'unknown',
      timestamp: new Date().toISOString()
    }, 'error')
    console.error('Ошибка получения статистики переводов:', error)
    return NextResponse.json(
      { success: false, error: 'Ошибка получения статистики' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { action, key, text, locale: _locale = 'ru' } = body

    switch (action) {
      case 'add':
        await translationManager.addTranslationKey(key, text)
        break
      case 'update':
        await translationManager.updateTranslationKey(key, text)
        break
      case 'remove':
        await translationManager.removeTranslationKey(key)
        break
      case 'sync':
        await translationManager.syncTranslations()
        break
      case 'validate':
        const issues = await translationManager.validateTranslations()
        return NextResponse.json({
          success: true,
          data: { issues }
        })
      default:
        return NextResponse.json(
          { success: false, error: 'Неизвестное действие' },
          { status: 400 }
        )
    }

    // Логируем создание перевода
    logSecurityEvent('Translation created', {
      locale: body.locale,
      ip: request.ip || 'unknown',
      timestamp: new Date().toISOString()
    }, 'info')

    return NextResponse.json({
      success: true,
      message: 'Действие выполнено успешно'
    })
  } catch (error) {
    // Логируем ошибку безопасности
    logSecurityEvent('Translation creation error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      ip: request.ip || 'unknown',
      timestamp: new Date().toISOString()
    }, 'error')
    console.error('Ошибка выполнения действия с переводами:', error)
    return NextResponse.json(
      { success: false, error: 'Ошибка выполнения действия' },
      { status: 500 }
    )
  }
} 