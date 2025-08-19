import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { authenticateRequest as _authenticateRequest, isAdmin as _isAdmin } from '@/lib/auth'
import { strictRateLimit } from '@/lib/rateLimit'
import { strictCors, applyCorsHeaders as _applyCorsHeaders } from '@/lib/cors'
import { createSecureResponse, logSecurityEvent, applySecurityHeaders } from '@/lib/security'

// Пути к файлам переводов
const getTranslationPath = (locale: string) => {
  return path.join(process.cwd(), 'messages', `${locale}.json`)
}

// Чтение файла перевода
const readTranslationFile = (locale: string) => {
  try {
    const filePath = getTranslationPath(locale)
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(fileContent)
  } catch (error) {
    console.error(`Error reading translation file for ${locale}:`, error)
    return null
  }
}

// Запись файла перевода
const writeTranslationFile = (locale: string, data: Record<string, unknown>) => {
  try {
    const filePath = getTranslationPath(locale)
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
    return true
  } catch (error) {
    console.error(`Error writing translation file for ${locale}:`, error)
    return false
  }
}

// GET - получение контента
export async function GET(request: NextRequest) {
  try {
    // Применяем CORS
    const corsHeaders = strictCors(request)
    if (corsHeaders instanceof NextResponse) {
      return applySecurityHeaders(corsHeaders)
    }

    // Применяем rate limiting
    const rateLimitResult = strictRateLimit(request)
    if (rateLimitResult) {
      return applySecurityHeaders(rateLimitResult)
    }

    const { searchParams } = new URL(request.url)
    const locale = searchParams.get('locale') || 'ru'
    const section = searchParams.get('section')

    const translations = readTranslationFile(locale)
    if (!translations) {
      return createSecureResponse({
        success: false,
        error: 'Translation file not found'
      }, 404)
    }

    // Если указана секция, возвращаем только её
    if (section) {
      const sectionData = getNestedValue(translations, section)
      return createSecureResponse({
        success: true,
        data: sectionData,
        locale,
        section
      })
    }

    // Возвращаем весь контент
    return createSecureResponse({
      success: true,
      data: translations,
      locale
    })
  } catch (error) {
    // Логируем ошибку безопасности
    logSecurityEvent('Content access error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      ip: request.ip || 'unknown',
      timestamp: new Date().toISOString()
    }, 'error')
    console.error('Error getting content:', error)
    return createSecureResponse({
      success: false,
      error: 'Internal server error'
    }, 500)
  }
}

// POST - обновление контента
export async function POST(request: NextRequest) {
  try {
    // Применяем CORS
    const corsHeaders = strictCors(request)
    if (corsHeaders instanceof NextResponse) {
      return applySecurityHeaders(corsHeaders)
    }

    // Применяем rate limiting
    const rateLimitResult = strictRateLimit(request)
    if (rateLimitResult) {
      return applySecurityHeaders(rateLimitResult)
    }

    const body = await request.json()
    const { locale = 'ru', section, data } = body

    if (!section || !data) {
      return createSecureResponse({
        success: false,
        error: 'Section and data are required'
      }, 400)
    }

    const translations = readTranslationFile(locale)
    if (!translations) {
      return createSecureResponse({
        success: false,
        error: 'Translation file not found'
      }, 404)
    }

    // Обновляем указанную секцию
    const updatedTranslations = setNestedValue(translations, section, data)

    // Сохраняем файл
    const success = writeTranslationFile(locale, updatedTranslations)
    if (!success) {
      return createSecureResponse({
        success: false,
        error: 'Failed to save translation file'
      }, 500)
    }

    return createSecureResponse({
      success: true,
      message: 'Content updated successfully',
      locale,
      section
    })
  } catch (error) {
    console.error('Error updating content:', error)
    return createSecureResponse({
      success: false,
      error: 'Internal server error'
    }, 500)
  }
}

// PUT - обновление всего контента
export async function PUT(request: NextRequest) {
  try {
    // Применяем CORS
    const corsHeaders = strictCors(request)
    if (corsHeaders instanceof NextResponse) {
      return applySecurityHeaders(corsHeaders)
    }

    // Применяем rate limiting
    const rateLimitResult = strictRateLimit(request)
    if (rateLimitResult) {
      return applySecurityHeaders(rateLimitResult)
    }

    const body = await request.json()
    const { locale = 'ru', data } = body

    if (!data) {
      return createSecureResponse({
        success: false,
        error: 'Data is required'
      }, 400)
    }

    // Сохраняем весь файл
    const success = writeTranslationFile(locale, data)
    if (!success) {
      return createSecureResponse({
        success: false,
        error: 'Failed to save translation file'
      }, 500)
    }

    // Логируем обновление контента
    logSecurityEvent('Content updated', {
      section: body.section,
      ip: request.ip || 'unknown',
      timestamp: new Date().toISOString()
    }, 'info')

    return createSecureResponse({
      success: true,
      message: 'Content updated successfully',
      locale
    })
  } catch (error) {
    // Логируем ошибку безопасности
    logSecurityEvent('Content update error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      ip: request.ip || 'unknown',
      timestamp: new Date().toISOString()
    }, 'error')
    console.error('Error updating content:', error)
    return createSecureResponse({
      success: false,
      error: 'Internal server error'
    }, 500)
  }
}

// Вспомогательные функции для работы с вложенными объектами
function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  const keys = path.split('.')
  let current: unknown = obj
  
  for (const key of keys) {
    if (current && typeof current === 'object' && current !== null && key in current) {
      current = (current as Record<string, unknown>)[key]
    } else {
      return null
    }
  }
  
  return current
}

function setNestedValue(obj: Record<string, unknown>, path: string, value: unknown): Record<string, unknown> {
  const keys = path.split('.')
  const lastKey = keys.pop()
  let current: Record<string, unknown> = obj
  
  for (const key of keys) {
    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {}
    }
    current = current[key] as Record<string, unknown>
  }
  
  if (lastKey) {
    current[lastKey] = value
  }
  
  return obj
}

