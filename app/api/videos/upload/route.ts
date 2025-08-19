import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { authenticateRequest, isAdmin } from '@/lib/auth'
import { strictRateLimit } from '@/lib/rateLimit'
import { strictCors, applyCorsHeaders as _applyCorsHeaders } from '@/lib/cors'
import { createSecureResponse, logSecurityEvent, applySecurityHeaders } from '@/lib/security'

export async function POST(request: NextRequest) {
  try {
    // Проверяем аутентификацию
    const authResult = await authenticateRequest(request)
    if (!authResult.success) {
      return createSecureResponse({ error: 'Unauthorized' }, 401)
    }

    // Проверяем права администратора
    if (!authResult.user || !isAdmin(authResult.user)) {
      return createSecureResponse({ error: 'Forbidden' }, 403)
    }

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

    const formData = await request.formData()
    const file = formData.get('video') as File
    const metadata = JSON.parse(formData.get('metadata') as string)
    
    if (!file) {
      return createSecureResponse({ error: 'No video file provided' }, 400)
    }

    // Проверяем тип файла
    if (!file.type.startsWith('video/')) {
      return createSecureResponse({ error: 'Invalid file type. Only video files are allowed.' }, 400)
    }

    // Проверяем размер файла (максимум 500MB)
    const maxSize = 500 * 1024 * 1024 // 500MB
    if (file.size > maxSize) {
      return createSecureResponse({ error: 'File too large. Maximum size is 500MB.' }, 400)
    }
    
    // Создаем директорию для видео
    const uploadDir = join(process.cwd(), 'public', 'videos', metadata.languageCode)
    await mkdir(uploadDir, { recursive: true })
    
    // Генерируем уникальное имя файла с качеством
    const quality = metadata.quality || 'hd'
    const timestamp = Date.now()
    const fileName = `${metadata.videoId}-${quality}-${timestamp}.mp4`
    const filePath = join(uploadDir, fileName)
    
    // Сохраняем файл
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)
    
    // Возвращаем URL для сохранения в базе
    const videoUrl = `/videos/${metadata.languageCode}/${fileName}`
    
    // Логируем загрузку
    logSecurityEvent('Video file uploaded', {
      fileName,
      quality,
      language: metadata.languageCode,
      size: file.size,
      user: authResult.user.email,
      timestamp: new Date().toISOString()
    }, 'info')

    return createSecureResponse({ 
      success: true, 
      videoUrl,
      fileName,
      quality,
      size: file.size
    })
  } catch (error) {
    console.error('Upload error:', error)
    
    // Логируем ошибку
    logSecurityEvent('Video upload error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      ip: request.ip || 'unknown',
      timestamp: new Date().toISOString()
    }, 'error')
    
    return createSecureResponse({ error: 'Upload failed' }, 500)
  }
}
