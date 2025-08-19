import { translateText } from '@/lib/translate'
import { 
  SUPPORTED_LANGUAGES, 
  LanguageConfig, 
  TranslationKey, 
  TranslationManagerConfig,
  TranslationCache 
} from '@/lib/types'

export class TranslationManager {
  private static instance: TranslationManager
  private translations: Map<string, any> = new Map()
  private cache: TranslationCache = {}
  private config: TranslationManagerConfig = {
    defaultLanguage: 'ru',
    fallbackLanguage: 'ru',
    autoSave: true,
    cacheEnabled: true
  }

  static getInstance(): TranslationManager {
    if (!TranslationManager.instance) {
      TranslationManager.instance = new TranslationManager()
    }
    return TranslationManager.instance
  }

  // Добавить новый ключ перевода
  async addTranslationKey(key: string, russianText: string): Promise<void> {
    try {
      // Сохраняем русский текст
      this.translations.set(`ru.${key}`, russianText)

      // Автоматически переводим на другие языки
      for (const lang of SUPPORTED_LANGUAGES) {
        if (lang.autoTranslate && lang.code !== 'ru') {
          const translatedText = await translateText(russianText, lang.code, 'ru')
          this.translations.set(`${lang.code}.${key}`, translatedText)
          
          // Кэшируем перевод
          if (this.config.cacheEnabled) {
            this.cache[key] = {
              ...this.cache[key],
              [lang.code]: {
                text: translatedText,
                timestamp: Date.now()
              }
            }
          }
        }
      }

      // Сохраняем в файлы если включен автосохранение
      if (this.config.autoSave) {
        await this.saveTranslations()
      }
    } catch (error) {
      console.error('Error adding translation key:', error)
      throw error
    }
  }

  // Обновить существующий ключ
  async updateTranslationKey(key: string, russianText: string): Promise<void> {
    await this.addTranslationKey(key, russianText)
  }

  // Получить перевод
  getTranslation(locale: string, key: string): string {
    return this.translations.get(`${locale}.${key}`) || key
  }

  // Получить перевод с кэшированием
  async getTranslationWithCache(locale: string, key: string): Promise<string> {
    // Проверяем кэш
    if (this.config.cacheEnabled && this.cache[key] && this.cache[key][locale]) {
      const cached = this.cache[key][locale]
      const cacheAge = Date.now() - cached.timestamp
      
      // Кэш действителен 24 часа
      if (cacheAge < 24 * 60 * 60 * 1000) {
        return cached.text
      }
    }

    // Если нет в кэше или кэш устарел, получаем перевод
    const translation = this.getTranslation(locale, key)
    
    // Кэшируем результат
    if (this.config.cacheEnabled) {
      this.cache[key] = {
        ...this.cache[key],
        [locale]: {
          text: translation,
          timestamp: Date.now()
        }
      }
    }

    return translation
  }

  // Массовый перевод
  async translateMultipleKeys(keys: string[], targetLocale: string): Promise<Record<string, string>> {
    const results: Record<string, string> = {}
    
    for (const key of keys) {
      const russianText = this.getTranslation('ru', key)
      if (russianText && russianText !== key) {
        const translation = await translateText(russianText, targetLocale, 'ru')
        results[key] = translation
      }
    }
    
    return results
  }

  // Сохранить переводы в файлы
  private async saveTranslations(): Promise<void> {
    // Проверяем, что мы на сервере
    if (typeof window !== 'undefined') {
      console.warn('saveTranslations called on client side')
      return
    }

    const translationsByLang: Record<string, any> = {}

    this.translations.forEach((value, key) => {
      const [lang, ...keyParts] = key.split('.')
      if (!translationsByLang[lang]) {
        translationsByLang[lang] = {}
      }

      // Создаем вложенную структуру
      let current = translationsByLang[lang]
      for (let i = 0; i < keyParts.length - 1; i++) {
        if (!current[keyParts[i]]) {
          current[keyParts[i]] = {}
        }
        current = current[keyParts[i]]
      }
      current[keyParts[keyParts.length - 1]] = value
    })

    // Сохраняем каждый файл
    Object.entries(translationsByLang).forEach(async ([lang, translations]) => {
      try {
        const fs = require('fs').promises
        await fs.writeFile(
          `messages/${lang}.json`,
          JSON.stringify(translations, null, 2),
          'utf-8'
        )
      } catch (error) {
        console.error(`Error saving translations for ${lang}:`, error)
      }
    })
  }

  // Загрузить переводы из файлов
  async loadTranslations(): Promise<void> {
    // Проверяем, что мы на сервере
    if (typeof window !== 'undefined') {
      console.warn('loadTranslations called on client side')
      return
    }

    try {
      const fs = require('fs').promises
      
      for (const lang of SUPPORTED_LANGUAGES) {
        const filePath = `messages/${lang.code}.json`
        try {
          const content = await fs.readFile(filePath, 'utf-8')
          const translations = JSON.parse(content)
          
          // Загружаем в память
          this.flattenTranslations(translations, lang.code)
        } catch (error) {
          console.warn(`Translation file not found: ${filePath}`)
        }
      }
    } catch (error) {
      console.error('Error loading translations:', error)
    }
  }

  // Преобразовать вложенную структуру в плоскую
  private flattenTranslations(obj: any, lang: string, prefix: string = ''): void {
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key
      
      if (typeof value === 'object' && value !== null) {
        this.flattenTranslations(value, lang, fullKey)
      } else {
        this.translations.set(`${lang}.${fullKey}`, value)
      }
    }
  }

  // Очистить кэш
  clearCache(): void {
    this.cache = {}
  }

  // Получить статистику
  getStats(): { totalKeys: number; cachedKeys: number; languages: string[] } {
    const keys = new Set<string>()
    this.translations.forEach((value, key) => {
      const [, ...keyParts] = key.split('.')
      keys.add(keyParts.join('.'))
    })

    return {
      totalKeys: keys.size,
      cachedKeys: Object.keys(this.cache).length,
      languages: SUPPORTED_LANGUAGES.map(lang => lang.code)
    }
  }

  // Получить статистику переводов (для API)
  async getTranslationStats(): Promise<{ totalKeys: number; cachedKeys: number; languages: string[] }> {
    return this.getStats()
  }

  // Удалить ключ перевода
  async removeTranslationKey(key: string): Promise<void> {
    for (const lang of SUPPORTED_LANGUAGES) {
      this.translations.delete(`${lang.code}.${key}`)
    }
    
    // Удаляем из кэша
    delete this.cache[key]
    
    if (this.config.autoSave) {
      await this.saveTranslations()
    }
  }

  // Синхронизировать переводы
  async syncTranslations(): Promise<void> {
    await this.loadTranslations()
    await this.saveTranslations()
  }

  // Валидировать переводы
  async validateTranslations(): Promise<string[]> {
    const issues: string[] = []
    
    // Проверяем все ключи на наличие переводов
    const allKeys = await this.getAllTranslationKeys()
    
    for (const key of allKeys) {
      for (const lang of SUPPORTED_LANGUAGES) {
        const translation = this.getTranslation(lang.code, key)
        if (!translation || translation === key) {
          issues.push(`Missing translation for key "${key}" in language "${lang.code}"`)
        }
      }
    }
    
    return issues
  }

  // Получить все ключи переводов
  async getAllTranslationKeys(): Promise<string[]> {
    const keys = new Set<string>()
    this.translations.forEach((value, key) => {
      const [, ...keyParts] = key.split('.')
      keys.add(keyParts.join('.'))
    })
    return Array.from(keys)
  }

  // Получить ключи для конкретного языка
  async getLanguageKeys(language: string): Promise<string[]> {
    const keys: string[] = []
    this.translations.forEach((value, key) => {
      const [lang, ...keyParts] = key.split('.')
      if (lang === language) {
        keys.push(keyParts.join('.'))
      }
    })
    return keys
  }

  // Добавить перевод для конкретного языка
  async addTranslation(language: string, key: string, text: string): Promise<void> {
    this.translations.set(`${language}.${key}`, text)
  }

  // Перевести текст
  async translateText(text: string, targetLanguage: string, sourceLanguage: string): Promise<string> {
    try {
      const translatedText = await translateText(text, targetLanguage, sourceLanguage)
      return translatedText
    } catch (error) {
      console.error('Error translating text:', error)
      return text
    }
  }

  // Сохранить все переводы
  async saveAllTranslations(): Promise<void> {
    await this.saveTranslations()
  }
}

// Экспортируем глобальный экземпляр
export const translationManager = TranslationManager.getInstance()

// Инициализируем загрузку переводов
translationManager.loadTranslations().catch(console.error)
