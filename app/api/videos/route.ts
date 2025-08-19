import { NextRequest, NextResponse } from 'next/server'
import { VideoData, VideoCollection } from '@/lib/types'
import { authenticateRequest, isAdmin } from '@/lib/auth'
import { strictRateLimit } from '@/lib/rateLimit'
import { strictCors, applyCorsHeaders as _applyCorsHeaders } from '@/lib/cors'
import { createSecureResponse, logSecurityEvent, applySecurityHeaders } from '@/lib/security'
import { getVideosByLanguage } from '@/lib/videoData'

// Принудительно делаем роут динамическим
export const dynamic = 'force-dynamic'

// Получаем данные о видео из нового файла
const getVideos = (): VideoCollection => {
  return {
    'en': getVideosByLanguage('en'),
    'zh': getVideosByLanguage('zh'),
    'ru': getVideosByLanguage('ru'),
    'th': getVideosByLanguage('th')
  }
}

let videos: VideoCollection = getVideos()

// Получить все видео
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
    const language = searchParams.get('language')
    
    // console.log('API: Requested language:', language)
    // console.log('API: Available languages:', Object.keys(videos))
    
    if (language && videos[language]) {
      // console.log('API: Returning videos for language:', language, videos[language])
      return createSecureResponse({ videos: videos[language] })
    }
    
    // console.log('API: Returning all videos')
    return createSecureResponse({ videos })
  } catch (error) {
    // Логируем ошибку безопасности
    logSecurityEvent('Videos access error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      ip: request.ip || 'unknown',
      timestamp: new Date().toISOString()
    }, 'error')
    console.error('API: Error fetching videos:', error)
    return createSecureResponse(
      { error: 'Failed to fetch videos' },
      500
    )
  }
}

// Добавить новое видео
export async function POST(request: NextRequest) {
  try {
    // Проверяем аутентификацию
    const authResult = await authenticateRequest(request)
    if (!authResult.success) {
      return createSecureResponse(
        { error: 'Unauthorized' },
        401
      )
    }

    // Проверяем права администратора
    if (!authResult.user || !isAdmin(authResult.user)) {
      return createSecureResponse(
        { error: 'Forbidden' },
        403
      )
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

    const body = await request.json()
    const { title, description, youtubeUrl, language, languageCode, duration, quality } = body
    
    const newVideo: VideoData = {
      id: Date.now().toString(),
      title,
      description,
      youtubeUrl: youtubeUrl || '',
      thumbnail: `https://img.youtube.com/vi/${youtubeUrl?.split('v=')[1]?.split('&')[0] || youtubeUrl?.split('youtu.be/')[1]?.split('?')[0] || ''}/maxresdefault.jpg`,
      duration,
      quality,
      language,
      languageCode,
      createdAt: new Date().toISOString(),
      isActive: true,
      videoType: 'youtube'
    }
    
    if (!videos[languageCode]) {
      videos[languageCode] = []
    }
    
    videos[languageCode].push(newVideo)
    
    // Логируем загрузку видео
    logSecurityEvent('Video uploaded', {
      videoName: title, // Assuming title is the video name for logging
      ip: request.ip || 'unknown',
      timestamp: new Date().toISOString()
    }, 'info')

    return createSecureResponse({ video: newVideo }, 201)
  } catch (error) {
    // Логируем ошибку безопасности
    logSecurityEvent('Video upload error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      ip: request.ip || 'unknown',
      timestamp: new Date().toISOString()
    }, 'error')
    return createSecureResponse(
      { error: 'Failed to create video' },
      500
    )
  }
}

// Обновить видео
export async function PUT(request: NextRequest) {
  try {
    // Проверяем аутентификацию
    const authResult = await authenticateRequest(request)
    if (!authResult.success) {
      return createSecureResponse(
        { error: 'Unauthorized' },
        401
      )
    }

    // Проверяем права администратора
    if (!authResult.user || !isAdmin(authResult.user)) {
      return createSecureResponse(
        { error: 'Forbidden' },
        403
      )
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

    const body = await request.json()
    const { id, languageCode, ...updateData } = body
    
    if (!videos[languageCode]) {
      return createSecureResponse(
        { error: 'Language not found' },
        404
      )
    }
    
    const videoIndex = videos[languageCode].findIndex(v => v.id === id)
    if (videoIndex === -1) {
      return createSecureResponse(
        { error: 'Video not found' },
        404
      )
    }
    
    // Обновляем видео, сохраняя существующие поля если они не переданы
    const existingVideo = videos[languageCode][videoIndex]
    videos[languageCode][videoIndex] = {
      ...existingVideo,
      ...updateData,
      // Обеспечиваем что videoType всегда присутствует
      videoType: 'youtube'
    }
    
    return createSecureResponse({ video: videos[languageCode][videoIndex] })
  } catch {
    return createSecureResponse(
      { error: 'Failed to update video' },
      500
    )
  }
}

// Удалить видео
export async function DELETE(request: NextRequest) {
  try {
    // Проверяем аутентификацию
    const authResult = await authenticateRequest(request)
    if (!authResult.success) {
      return createSecureResponse(
        { error: 'Unauthorized' },
        401
      )
    }

    // Проверяем права администратора
    if (!authResult.user || !isAdmin(authResult.user)) {
      return createSecureResponse(
        { error: 'Forbidden' },
        403
      )
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

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const languageCode = searchParams.get('languageCode')
    
    if (!id || !languageCode) {
      return createSecureResponse(
        { error: 'Missing id or languageCode' },
        400
      )
    }
    
    if (!videos[languageCode]) {
      return createSecureResponse(
        { error: 'Language not found' },
        404
      )
    }
    
    const videoIndex = videos[languageCode].findIndex(v => v.id === id)
    if (videoIndex === -1) {
      return createSecureResponse(
        { error: 'Video not found' },
        404
      )
    }
    
    videos[languageCode].splice(videoIndex, 1)
    
    return createSecureResponse({ success: true })
  } catch {
    return createSecureResponse(
      { error: 'Failed to delete video' },
      500
    )
  }
}
