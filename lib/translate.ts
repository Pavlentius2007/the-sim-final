import { Translate } from '@google-cloud/translate/build/src/v2'

// Типы для конфигурации
interface TranslateConfig {
  apiKey?: string
  timeout?: number
  retries?: number
}

// Класс для управления переводами
export class TranslateService {
  private config: TranslateConfig
  private cache: Map<string, string> = new Map()
  private translateClient: Translate | null = null

  constructor(config: TranslateConfig = {}) {
    this.config = {
      apiKey: process.env.GOOGLE_TRANSLATE_API_KEY,
      timeout: 10000,
      retries: 3,
      ...config
    }

    // Инициализируем Google Translate клиент
    if (this.config.apiKey) {
      this.translateClient = new Translate({
        key: this.config.apiKey
      })
    }
  }

  /**
   * Переводит текст с одного языка на другой
   */
  async translateText(
    text: string,
    from: string = 'ru',
    to: string = 'en'
  ): Promise<string> {
    // Проверяем кэш
    const cacheKey = `${text}:${from}:${to}`
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!
    }

    // Проверяем API ключ
    if (!this.config.apiKey || !this.translateClient) {
      console.warn('Google Translate API ключ не настроен. Используется fallback.')
      return this.fallbackTranslate(text, from, to)
    }

    try {
      const [translation] = await this.translateClient.translate(text, {
        from: from,
        to: to
      })

      if (translation) {
        // Сохраняем в кэш
        this.cache.set(cacheKey, translation)
        return translation
      } else {
        throw new Error('Пустой ответ от Google Translate')
      }
    } catch (error) {
      console.error('Ошибка перевода:', error)
      
      // Пробуем fallback
      return this.fallbackTranslate(text, from, to)
    }
  }

  /**
   * Fallback перевод (простая замена для базовых фраз)
   */
  private fallbackTranslate(text: string, from: string, to: string): string {
    const fallbackTranslations: Record<string, Record<string, Record<string, string>>> = {
      'ru': {
        'en': {
          'Привет': 'Hello',
          'Спасибо': 'Thank you',
          'Добро пожаловать': 'Welcome',
          'О нас': 'About us',
          'Контакты': 'Contacts',
          'Услуги': 'Services',
          'Цены': 'Prices',
          'Помощь': 'Help',
          'Поддержка': 'Support'
        },
        'zh': {
          'Привет': '你好',
          'Спасибо': '谢谢',
          'Добро пожаловать': '欢迎',
          'О нас': '关于我们',
          'Контакты': '联系我们',
          'Услуги': '服务',
          'Цены': '价格',
          'Помощь': '帮助',
          'Поддержка': '支持'
        },
        'th': {
          'Привет': 'สวัสดี',
          'Спасибо': 'ขอบคุณ',
          'Добро пожаловать': 'ยินดีต้อนรับ',
          'О нас': 'เกี่ยวกับเรา',
          'Контакты': 'ติดต่อเรา',
          'Услуги': 'บริการ',
          'Цены': 'ราคา',
          'Помощь': 'ช่วยเหลือ',
          'Поддержка': 'สนับสนุน'
        }
      }
    }

    const translations = fallbackTranslations[from]?.[to]
    if (translations && translations[text]) {
      return translations[text]
    }

    // Если нет перевода, возвращаем оригинальный текст
    return text
  }

  /**
   * Очищает кэш переводов
   */
  clearCache(): void {
    this.cache.clear()
  }

  /**
   * Получает статистику кэша
   */
  getCacheStats(): { size: number } {
    return {
      size: this.cache.size
    }
  }

  /**
   * Проверяет доступность API
   */
  async checkApiHealth(): Promise<boolean> {
    if (!this.config.apiKey) {
      return false
    }

    try {
      await this.translateText('test', 'en', 'ru')
      return true
    } catch (error) {
      console.error('API недоступен:', error)
      return false
    }
  }
}

// Создаем глобальный экземпляр сервиса
export const translateService = new TranslateService()

// Экспортируем функцию для обратной совместимости
export async function translateText(text: string, from: string = 'ru', to: string = 'en'): Promise<string> {
  if (!text || text.trim() === '') {
    return text
  }

  try {
    return translateService.translateText(text, from, to)
  } catch (error) {
    console.error('Translation error:', error)
    return text // Возвращаем исходный текст в случае ошибки
  }
}
