import { NextRequest } from 'next/server'

// Простая защита от злоупотребления - проверка Origin
function isValidOrigin(origin: string | null): boolean {
  if (!origin) return false
  
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
    'https://thesim.site',
    'https://www.thesim.site',
    'http://localhost:3000'
  ]
  
  return allowedOrigins.some(allowed => origin.startsWith(allowed.trim()))
}

export async function POST(request: NextRequest) {
  try {
    // Проверка Origin для защиты от CSRF
    const origin = request.headers.get('origin')
    if (process.env.NODE_ENV === 'production' && !isValidOrigin(origin)) {
      return Response.json(
        { error: 'Неавторизованный запрос' },
        { status: 403 }
      )
    }
    
    const { message, chatId } = await request.json()
    
    // Валидация данных
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return Response.json(
        { error: 'Сообщение обязательно для заполнения' },
        { status: 400 }
      )
    }
    
    if (message.length > 4096) {
      return Response.json(
        { error: 'Сообщение слишком длинное (максимум 4096 символов)' },
        { status: 400 }
      )
    }
    
    const botToken = process.env.TELEGRAM_BOT_TOKEN
    const defaultChatId = process.env.TELEGRAM_CHAT_ID
    
    if (!botToken) {
      return Response.json({ 
        error: 'Telegram bot token not configured' 
      }, { status: 500 })
    }
    
    const targetChatId = chatId || defaultChatId
    
    if (!targetChatId) {
      return Response.json({ 
        error: 'Telegram chat ID not configured' 
      }, { status: 500 })
    }
    
    // Отправляем сообщение в Telegram
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: targetChatId,
          text: message,
          parse_mode: 'Markdown',
          disable_web_page_preview: true,
        }),
      }
    )
    
    if (!telegramResponse.ok) {
      const errorData = await telegramResponse.json().catch(() => ({}))
      // Не логируем детали ошибки в production для безопасности
      if (process.env.NODE_ENV !== 'production') {
        console.error('Telegram API error:', errorData)
      }
      throw new Error(`Telegram API error: ${errorData.description || 'Unknown error'}`)
    }
    
    // Проверяем что ответ успешный (результат не нужен для безопасности)
    await telegramResponse.json()
    
    return Response.json({
      success: true,
      message: 'Message sent to Telegram successfully'
      // Не возвращаем telegramResult в production для безопасности
    })
    
  } catch (error) {
    // Не логируем детали ошибки в production
    if (process.env.NODE_ENV !== 'production') {
      console.error('Telegram send error:', error)
    }
    return Response.json({ 
      error: 'Failed to send message to Telegram',
      details: process.env.NODE_ENV === 'production' 
        ? undefined 
        : (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 })
  }
}
