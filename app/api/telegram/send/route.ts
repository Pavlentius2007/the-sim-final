import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { message, chatId } = await request.json()
    
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
      const errorData = await telegramResponse.json()
      console.error('Telegram API error:', errorData)
      throw new Error(`Telegram API error: ${errorData.description}`)
    }
    
    const result = await telegramResponse.json()
    
    return Response.json({
      success: true,
      message: 'Message sent to Telegram successfully',
      telegramResult: result
    })
    
  } catch (error) {
    console.error('Telegram send error:', error)
    return Response.json({ 
      error: 'Failed to send message to Telegram',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
