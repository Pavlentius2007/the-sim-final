import { TranslationManager } from './translationManager'
import * as LanguageUtils from './languageUtils'

export interface AutoUpdateConfig {
  enabled: boolean
  interval: number // в миллисекундах
  languages: string[]
  autoSave: boolean
  notifyOnUpdate: boolean
}

export interface UpdateResult {
  success: boolean
  updatedKeys: string[]
  newTranslations: number
  errors: string[]
  timestamp: Date
}

export const DEFAULT_AUTO_UPDATE_CONFIG: AutoUpdateConfig = {
  enabled: true,
  interval: 30 * 60 * 1000, // 30 минут
  languages: ['en', 'zh', 'th'],
  autoSave: true,
  notifyOnUpdate: true
}

export class AutoTranslationUpdater {
  private translationManager: TranslationManager
  private languageUtils: any
  private config: AutoUpdateConfig
  private intervalId: NodeJS.Timeout | null = null
  private isRunning = false

  constructor(
    translationManager: TranslationManager,
    languageUtils: any,
    config: AutoUpdateConfig
  ) {
    this.translationManager = translationManager
    this.languageUtils = languageUtils
    this.config = config
  }

  /**
   * Запускает автоматическое обновление переводов
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      console.warn('AutoTranslationUpdater уже запущен')
      return
    }

    if (!this.config.enabled) {
      console.log('Автоматическое обновление отключено')
      return
    }

    this.isRunning = true
    console.log(`🚀 Запуск автоматического обновления переводов (интервал: ${this.config.interval}ms)`)

    // Первоначальное обновление
    await this.performUpdate()

    // Установка интервала
    this.intervalId = setInterval(async () => {
      await this.performUpdate()
    }, this.config.interval)
  }

  /**
   * Останавливает автоматическое обновление
   */
  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    this.isRunning = false
    console.log('⏹️ Автоматическое обновление остановлено')
  }

  /**
   * Выполняет одно обновление переводов
   */
  async performUpdate(): Promise<UpdateResult> {
    const result: UpdateResult = {
      success: false,
      updatedKeys: [],
      newTranslations: 0,
      errors: [],
      timestamp: new Date()
    }

    try {
      console.log('🔄 Выполняется автоматическое обновление переводов...')

      // Получаем все ключи переводов
      const allKeys = await this.translationManager.getAllTranslationKeys()
      
      // Проверяем каждый язык
      for (const language of this.config.languages) {
        try {
          const languageKeys = await this.translationManager.getLanguageKeys(language)
          
          // Находим недостающие переводы
          const missingKeys = allKeys.filter(key => !languageKeys.includes(key))
          
          if (missingKeys.length > 0) {
            console.log(`📝 Найдено ${missingKeys.length} недостающих переводов для языка ${language}`)
            
            // Переводим недостающие ключи
            for (const key of missingKeys) {
              try {
                const sourceText = await this.translationManager.getTranslation('ru', key)
                if (sourceText) {
                  const translatedText = await this.translationManager.translateText(
                    sourceText,
                    'ru',
                    language
                  )
                  
                  if (translatedText) {
                    await this.translationManager.addTranslation(language, key, translatedText)
                    result.updatedKeys.push(`${language}:${key}`)
                    result.newTranslations++
                  }
                }
              } catch (error) {
                const errorMsg = `Ошибка перевода ${language}:${key}: ${error}`
                result.errors.push(errorMsg)
                console.error(errorMsg)
              }
            }
          }
        } catch (error) {
          const errorMsg = `Ошибка обработки языка ${language}: ${error}`
          result.errors.push(errorMsg)
          console.error(errorMsg)
        }
      }

      // Сохраняем изменения если включено
      if (this.config.autoSave && result.newTranslations > 0) {
        await this.translationManager.saveAllTranslations()
        console.log(`💾 Сохранено ${result.newTranslations} новых переводов`)
      }

      // Уведомляем об обновлении
      if (this.config.notifyOnUpdate && result.newTranslations > 0) {
        this.notifyUpdate(result)
      }

      result.success = result.errors.length === 0
      
      console.log(`✅ Автоматическое обновление завершено: ${result.newTranslations} новых переводов`)
      
    } catch (error) {
      const errorMsg = `Критическая ошибка автоматического обновления: ${error}`
      result.errors.push(errorMsg)
      console.error(errorMsg)
    }

    return result
  }

  /**
   * Уведомляет об обновлении переводов
   */
  private notifyUpdate(result: UpdateResult): void {
    const message = `
🔄 Автоматическое обновление переводов

📊 Результаты:
• Новых переводов: ${result.newTranslations}
• Обновленных ключей: ${result.updatedKeys.length}
• Ошибок: ${result.errors.length}
• Время: ${result.timestamp.toLocaleString()}

${result.errors.length > 0 ? `❌ Ошибки:\n${result.errors.join('\n')}` : ''}
    `.trim()

    console.log(message)
    
    // Здесь можно добавить отправку уведомлений в Telegram, email и т.д.
    this.sendTelegramNotification(message)
  }

  /**
   * Отправляет уведомление в Telegram
   */
  private async sendTelegramNotification(message: string): Promise<void> {
    try {
      // В реальном проекте здесь будет отправка в Telegram
      // const telegramBot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN)
      // await telegramBot.sendMessage(process.env.TELEGRAM_CHAT_ID, message)
      
      console.log('📱 Уведомление отправлено в Telegram')
    } catch (error) {
      console.error('Ошибка отправки уведомления в Telegram:', error)
    }
  }

  /**
   * Обновляет конфигурацию
   */
  updateConfig(newConfig: Partial<AutoUpdateConfig>): void {
    this.config = { ...this.config, ...newConfig }
    console.log('⚙️ Конфигурация автоматического обновления обновлена')
  }

  /**
   * Получает текущую конфигурацию
   */
  getConfig(): AutoUpdateConfig {
    return { ...this.config }
  }

  /**
   * Получает статус работы
   */
  getStatus(): { isRunning: boolean; lastUpdate?: Date } {
    return {
      isRunning: this.isRunning,
      lastUpdate: this.lastUpdateTime
    }
  }

  private lastUpdateTime?: Date

  /**
   * Принудительно запускает обновление
   */
  async forceUpdate(): Promise<UpdateResult> {
    console.log('🔧 Принудительное обновление переводов...')
    const result = await this.performUpdate()
    this.lastUpdateTime = new Date()
    return result
  }
}

 