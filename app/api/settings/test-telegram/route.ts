import { NextRequest, NextResponse } from 'next/server'

// POST - тестирование Telegram интеграции
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { botToken, chatId, message = 'Тестовое сообщение от The SIM Admin Panel' } = body
    
    if (!botToken || !chatId) {
      return NextResponse.json(
        { success: false, error: 'Bot token and chat ID are required' },
        { status: 400 }
      )
    }
    
    // Валидация формата токена
    const tokenPattern = /^[0-9]+:[a-zA-Z0-9_-]{35}$/
    if (!tokenPattern.test(botToken)) {
      return NextResponse.json(
        { success: false, error: 'Invalid bot token format' },
        { status: 400 }
      )
    }
    
    // Валидация формата chat ID
    const chatIdPattern = /^-?[0-9]+$/
    if (!chatIdPattern.test(chatId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid chat ID format' },
        { status: 400 }
      )
    }
    
    try {
      // Сначала проверяем информацию о боте
      const botInfoResponse = await fetch(`https://api.telegram.org/bot${botToken}/getMe`)
      const botInfo = await botInfoResponse.json()
      
      if (!botInfo.ok) {
        return NextResponse.json({
          success: false,
          error: 'Invalid bot token',
          details: botInfo.description || 'Bot token is not valid'
        }, { status: 400 })
      }
      
      // Проверяем права бота в чате
      try {
        const chatResponse = await fetch(`https://api.telegram.org/bot${botToken}/getChat?chat_id=${chatId}`)
        const chatInfo = await chatResponse.json()
        
        if (!chatInfo.ok) {
          return NextResponse.json({
            success: false,
            error: 'Cannot access chat',
            details: chatInfo.description || 'Bot cannot access the specified chat'
          }, { status: 400 })
        }
      } catch (chatError) {
        // Игнорируем ошибки получения информации о чате
        console.warn('Could not get chat info:', chatError)
      }
      
      // Отправляем тестовое сообщение
      const testMessageResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: `🔧 ${message}\n\n✅ Интеграция настроена успешно!\n📅 ${new Date().toLocaleString('ru-RU')}`,
          parse_mode: 'HTML'
        })
      })
      
      const testResult = await testMessageResponse.json()
      
      if (!testResult.ok) {
        return NextResponse.json({
          success: false,
          error: 'Failed to send test message',
          details: testResult.description || 'Unknown error occurred',
          botInfo: {
            id: botInfo.result.id,
            username: botInfo.result.username,
            firstName: botInfo.result.first_name
          }
        }, { status: 400 })
      }
      
      return NextResponse.json({
        success: true,
        message: 'Test message sent successfully',
        botInfo: {
          id: botInfo.result.id,
          username: botInfo.result.username,
          firstName: botInfo.result.first_name,
          canJoinGroups: botInfo.result.can_join_groups,
          canReadAllGroupMessages: botInfo.result.can_read_all_group_messages,
          supportsInlineQueries: botInfo.result.supports_inline_queries
        },
        messageInfo: {
          messageId: testResult.result.message_id,
          date: new Date(testResult.result.date * 1000).toISOString(),
          chatId: testResult.result.chat.id,
          chatType: testResult.result.chat.type
        }
      })
      
    } catch (telegramError) {
      console.error('Telegram API error:', telegramError)
      return NextResponse.json({
        success: false,
        error: 'Telegram API error',
        details: telegramError instanceof Error ? telegramError.message : 'Unknown error'
      }, { status: 500 })
    }
    
  } catch (error) {
    console.error('Error testing Telegram:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to test Telegram integration' },
      { status: 500 }
    )
  }
}

// GET - получение информации о текущих настройках Telegram
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const botToken = searchParams.get('botToken')
    
    if (!botToken) {
      return NextResponse.json({
        success: false,
        error: 'Bot token is required for getting bot info'
      }, { status: 400 })
    }
    
    try {
      // Получаем информацию о боте
      const botInfoResponse = await fetch(`https://api.telegram.org/bot${botToken}/getMe`)
      const botInfo = await botInfoResponse.json()
      
      if (!botInfo.ok) {
        return NextResponse.json({
          success: false,
          error: 'Invalid bot token',
          details: botInfo.description
        }, { status: 400 })
      }
      
      // Получаем обновления для проверки активности
      const updatesResponse = await fetch(`https://api.telegram.org/bot${botToken}/getUpdates?limit=1`)
      const updates = await updatesResponse.json()
      
      return NextResponse.json({
        success: true,
        data: {
          botInfo: {
            id: botInfo.result.id,
            username: botInfo.result.username,
            firstName: botInfo.result.first_name,
            canJoinGroups: botInfo.result.can_join_groups,
            canReadAllGroupMessages: botInfo.result.can_read_all_group_messages,
            supportsInlineQueries: botInfo.result.supports_inline_queries
          },
          isActive: updates.ok,
          lastUpdate: updates.ok && updates.result.length > 0 
            ? new Date(updates.result[0].update_id * 1000).toISOString()
            : null
        },
        message: 'Bot information retrieved successfully'
      })
      
    } catch (telegramError) {
      return NextResponse.json({
        success: false,
        error: 'Failed to connect to Telegram API',
        details: telegramError instanceof Error ? telegramError.message : 'Unknown error'
      }, { status: 500 })
    }
    
  } catch (error) {
    console.error('Error getting Telegram info:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get Telegram information' },
      { status: 500 }
    )
  }
}














