import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, telegram, message } = body

    // Список chat_id для отправки уведомлений
    const chatIds = [
      process.env.TELEGRAM_CHAT_ID, // Основной аккаунт
      process.env.TELEGRAM_CHAT_ID_2 || '1262412157' // @Pavlentius2007 (fallback)
    ].filter(Boolean) // Убираем пустые значения

    const messageText = `🚀 Новая заявка с сайта The SIM

👤 Имя: ${name}
📧 Email: ${email}
📱 Телефон: ${phone}
💬 Telegram: ${telegram || 'Не указан'}
💭 Сообщение: ${message || 'Нет сообщения'}

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

    console.log(`✅ Lead sent to ${successCount}/${chatIds.length} Telegram accounts`)

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
