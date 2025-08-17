interface TelegramMessage {
  text: string
  parse_mode?: 'HTML' | 'Markdown'
  disable_web_page_preview?: boolean
}

interface TranslationStats {
  totalKeys: number
  totalLanguages: number
  lastUpdate: string
  cacheSize: number
}

class TelegramService {
  private botToken: string | null = null
  private chatId: string | null = null
  private isEnabled: boolean = false

  constructor() {
    // Получаем токен из переменных окружения
    this.botToken = process.env.TELEGRAM_BOT_TOKEN || null
    this.chatId = process.env.TELEGRAM_CHAT_ID || null
    this.isEnabled = !!(this.botToken && this.chatId)
  }

  /**
   * Проверяет работоспособность Telegram API
   */
  async checkHealth(): Promise<boolean> {
    if (!this.isEnabled) {
      return false
    }

    try {
      const response = await fetch(`https://api.telegram.org/bot${this.botToken}/getMe`)
      const data = await response.json()
      return data.ok === true
    } catch (error) {
      console.error('Ошибка проверки здоровья Telegram:', error)
      return false
    }
  }

  /**
   * Отправляет сообщение в Telegram
   */
  async sendMessage(message: TelegramMessage): Promise<boolean> {
    if (!this.isEnabled) {
      console.warn('Telegram уведомления отключены (не настроены токен или chat_id)')
      return false
    }

    try {
      const response = await fetch(`https://api.telegram.org/bot${this.botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: this.chatId,
          text: message.text,
          parse_mode: message.parse_mode || 'HTML',
          disable_web_page_preview: message.disable_web_page_preview || true
        })
      })

      const data = await response.json()
      
      if (data.ok) {
        console.log('✅ Сообщение отправлено в Telegram')
        return true
      } else {
        console.error('❌ Ошибка отправки в Telegram:', data.description)
        return false
      }
    } catch (error) {
      console.error('❌ Ошибка отправки в Telegram:', error)
      return false
    }
  }

  /**
   * Отправляет статистику переводов
   */
  async sendTranslationStats(stats: TranslationStats): Promise<boolean> {
    const message = `
📊 <b>Статистика переводов</b>

🔑 Всего ключей: <b>${stats.totalKeys}</b>
🌍 Языков: <b>${stats.totalLanguages}</b>
💾 Размер кэша: <b>${stats.cacheSize}</b>
🕐 Последнее обновление: <b>${stats.lastUpdate}</b>

<i>Отправлено автоматически</i>
    `.trim()

    return this.sendMessage({ text: message })
  }

  /**
   * Отправляет уведомление об ошибке
   */
  async sendErrorNotification(error: string, context?: string): Promise<boolean> {
    const message = `
🚨 <b>Ошибка в системе переводов</b>

${context ? `📍 Контекст: <b>${context}</b>\n` : ''}
❌ Ошибка: <code>${error}</code>

🕐 Время: <b>${new Date().toLocaleString('ru-RU')}</b>
    `.trim()

    return this.sendMessage({ text: message })
  }

  /**
   * Отправляет уведомление об успешном обновлении
   */
  async sendUpdateNotification(updatedKeys: string[], newTranslations: number): Promise<boolean> {
    const message = `
✅ <b>Обновление переводов завершено</b>

🔄 Обновлено ключей: <b>${updatedKeys.length}</b>
🆕 Новых переводов: <b>${newTranslations}</b>

${updatedKeys.length > 0 ? `\n📝 Обновленные ключи:\n<code>${updatedKeys.slice(0, 10).join('\n')}</code>${updatedKeys.length > 10 ? '\n...и еще ' + (updatedKeys.length - 10) + ' ключей' : ''}` : ''}

🕐 Время: <b>${new Date().toLocaleString('ru-RU')}</b>
    `.trim()

    return this.sendMessage({ text: message })
  }

  /**
   * Отправляет тестовое сообщение
   */
  async sendTestMessage(): Promise<boolean> {
    const message = `
🧪 <b>Тестовое сообщение</b>

✅ Telegram уведомления работают корректно!

🕐 Время отправки: <b>${new Date().toLocaleString('ru-RU')}</b>
    `.trim()

    return this.sendMessage({ text: message })
  }

  /**
   * Получает статус сервиса
   */
  getStatus(): { enabled: boolean; configured: boolean } {
    return {
      enabled: this.isEnabled,
      configured: !!(this.botToken && this.chatId)
    }
  }
}

export const telegramService = new TelegramService()
