import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest, isAdmin } from '@/lib/auth'
import { strictRateLimit } from '@/lib/rateLimit'
import { strictCors, applyCorsHeaders as _applyCorsHeaders } from '@/lib/cors'
import { createSecureResponse, logSecurityEvent } from '@/lib/security'

// Принудительно делаем роут динамическим
export const dynamic = 'force-dynamic'

// Типы для настроек
interface SystemSettings {
  siteName: string
  siteDescription: string
  contactEmail: string
  telegramBotToken?: string
  autoTranslationEnabled: boolean
  monitoringEnabled: boolean
  maintenanceMode: boolean
}

// Моковые настройки по умолчанию
let systemSettings: SystemSettings = {
  siteName: 'The Sim',
  siteDescription: 'Инвестиционная платформа',
  contactEmail: 'info@thesim.in',
  autoTranslationEnabled: true,
  monitoringEnabled: true,
  maintenanceMode: false
}

// GET - получение настроек системы
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

    // Проверка аутентификации
    const auth = await authenticateRequest(request)
    if (!auth.success) {
      return createSecureResponse({
        success: false,
        error: 'Unauthorized'
      }, 401)
    }

    // Проверка прав администратора
    if (!auth.user || !isAdmin(auth.user)) {
      return createSecureResponse({
        success: false,
        error: 'Forbidden'
      }, 403)
    }

    // Логируем доступ к настройкам
    logSecurityEvent('Settings accessed', {
      ip: request.ip || 'unknown',
      timestamp: new Date().toISOString()
    }, 'info')

    return createSecureResponse({
      success: true,
      settings: systemSettings
    })

  } catch (error) {
    // Логируем ошибку безопасности
    logSecurityEvent('Settings access error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      ip: request.ip || 'unknown',
      timestamp: new Date().toISOString()
    }, 'error')

    console.error('Error getting settings:', error)
    return createSecureResponse({
      success: false,
      error: 'Internal server error'
    }, 500)
  }
}

// PUT - обновление настроек системы
export async function PUT(request: NextRequest) {
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

    // Проверка аутентификации
    const auth = await authenticateRequest(request)
    if (!auth.success) {
      return createSecureResponse({
        success: false,
        error: 'Unauthorized'
      }, 401)
    }

    // Проверка прав администратора
    if (!auth.user || !isAdmin(auth.user)) {
      return createSecureResponse({
        success: false,
        error: 'Forbidden'
      }, 403)
    }

    const body = await request.json()
    
    // Обновляем настройки
    systemSettings = { ...systemSettings, ...body }

    // Логируем обновление настроек
    logSecurityEvent('Settings updated', {
      settings: body,
      ip: request.ip || 'unknown',
      timestamp: new Date().toISOString()
    }, 'info')

    return createSecureResponse({
      success: true,
      message: 'Settings updated successfully',
      settings: systemSettings
    })

  } catch (error) {
    // Логируем ошибку безопасности
    logSecurityEvent('Settings update error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      ip: request.ip || 'unknown',
      timestamp: new Date().toISOString()
    }, 'error')

    console.error('Error updating settings:', error)
    return createSecureResponse({
      success: false,
      error: 'Internal server error'
    }, 500)
  }
}
