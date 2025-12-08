import { NextRequest, NextResponse } from 'next/server'

// Простая защита от спама - проверка Origin
function isValidOrigin(origin: string | null): boolean {
  if (!origin) return false
  
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
    'https://thesim.site',
    'https://www.thesim.site',
    'http://localhost:3000'
  ]
  
  return allowedOrigins.some(allowed => origin.startsWith(allowed.trim()))
}

// Валидация email
function isValidEmail(email: string): boolean {
  if (!email) return true // Email опциональный
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 255
}

// Валидация данных формы
function validateFormData(data: any): { valid: boolean; error?: string } {
  const { name, email, phone, socialNetwork, message } = data
  
  // Проверка имени
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return { valid: false, error: 'Имя обязательно для заполнения' }
  }
  if (name.length > 100) {
    return { valid: false, error: 'Имя слишком длинное' }
  }
  
  // Проверка email
  if (email && !isValidEmail(email)) {
    return { valid: false, error: 'Некорректный email адрес' }
  }
  
  // Проверка телефона
  if (phone && (typeof phone !== 'string' || phone.length > 20)) {
    return { valid: false, error: 'Некорректный номер телефона' }
  }
  
  // Проверка реферального кода
  if (socialNetwork && (typeof socialNetwork !== 'string' || socialNetwork.length > 50)) {
    return { valid: false, error: 'Некорректный реферальный код' }
  }
  
  // Проверка сообщения
  if (message && (typeof message !== 'string' || message.length > 1000)) {
    return { valid: false, error: 'Сообщение слишком длинное' }
  }
  
  return { valid: true }
}

export async function POST(request: NextRequest) {
  try {
    // Проверка Origin для защиты от CSRF
    const origin = request.headers.get('origin')
    if (process.env.NODE_ENV === 'production' && !isValidOrigin(origin)) {
      return NextResponse.json(
        { success: false, message: 'Неавторизованный запрос' },
        { status: 403 }
      )
    }
    
    const body = await request.json()
    
    // Валидация данных
    const validation = validateFormData(body)
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, message: validation.error },
        { status: 400 }
      )
    }
    
    const { name, email, phone, socialNetwork, message } = body
    
    // Санитизация данных (защита от XSS)
    const sanitize = (str: string | undefined): string => {
      if (!str) return ''
      return str
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .trim()
        .substring(0, 1000) // Ограничение длины
    }
    
    const sanitizedName = sanitize(name)
    const sanitizedEmail = email ? sanitize(email) : 'Не указан'
    const sanitizedPhone = phone ? sanitize(phone) : 'Не указан'
    const sanitizedSocialNetwork = socialNetwork ? sanitize(socialNetwork) : 'Не указан'
    const sanitizedMessage = message ? sanitize(message) : 'Нет сообщения'

    // Список chat_id для отправки уведомлений
    const chatIds = [
      process.env.TELEGRAM_CHAT_ID, // Основной аккаунт
      process.env.TELEGRAM_CHAT_ID_2 // Дополнительный аккаунт (опционально)
    ].filter(Boolean) // Убираем пустые значения
    
    if (chatIds.length === 0) {
      throw new Error('No Telegram chat IDs configured')
    }

    const messageText = `🚀 Новая заявка с сайта The SIM

👤 Имя: ${sanitizedName}
📧 Email: ${sanitizedEmail}
📱 Телефон: ${sanitizedPhone}
🎁 Реферальный код: ${sanitizedSocialNetwork}
💭 Сообщение: ${sanitizedMessage}

⏰ Время: ${new Date().toLocaleString('ru-RU')}
🆔 ID заявки: ${Date.now()}`

    // Отправляем уведомления на все аккаунты
    const telegramPromises = chatIds.map(chatId => 
      fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: messageText,
          parse_mode: 'HTML'
        })
      })
    )

    const responses = await Promise.all(telegramPromises)
    
    // Проверяем, что хотя бы одно сообщение отправилось успешно
    const successCount = responses.filter(response => response.ok).length
    
    if (successCount === 0) {
      throw new Error('Failed to send to any Telegram account')
    }

    // console.log(`✅ Lead sent to ${successCount}/${chatIds.length} Telegram accounts`)

    return NextResponse.json({ 
      success: true, 
      message: 'Заявка отправлена успешно!' 
    })

  } catch (error) {
    console.error('Error sending lead:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Произошла ошибка. Попробуйте еще раз.' 
      },
      { status: 500 }
    )
  }
}
