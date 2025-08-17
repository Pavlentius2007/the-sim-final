import { SUPPORTED_LANGUAGES, LanguageConfig, Locale } from '@/lib/types'

// Получить конфигурацию языка по коду
export function getLanguageConfig(code: string): LanguageConfig | undefined {
  return SUPPORTED_LANGUAGES.find(lang => lang.code === code)
}

// Получить все поддерживаемые языки
export function getSupportedLanguages(): LanguageConfig[] {
  return SUPPORTED_LANGUAGES
}

// Проверить, поддерживается ли язык
export function isLanguageSupported(code: string): boolean {
  return SUPPORTED_LANGUAGES.some(lang => lang.code === code)
}

// Получить языки с автоматическим переводом
export function getAutoTranslateLanguages(): LanguageConfig[] {
  return SUPPORTED_LANGUAGES.filter(lang => lang.autoTranslate)
}

// Получить коды языков
export function getLanguageCodes(): string[] {
  return SUPPORTED_LANGUAGES.map(lang => lang.code)
}

// Получить язык по умолчанию
export function getDefaultLanguage(): LanguageConfig {
  return SUPPORTED_LANGUAGES.find(lang => lang.code === 'ru')!
}

// Определить язык браузера
export function detectBrowserLanguage(): string {
  if (typeof window === 'undefined') return 'ru'
  
  const browserLang = navigator.language || navigator.languages?.[0] || 'ru'
  const langCode = browserLang.split('-')[0]
  
  return isLanguageSupported(langCode) ? langCode : 'ru'
}

// Форматировать название языка
export function formatLanguageName(code: string): string {
  const config = getLanguageConfig(code)
  return config ? config.name : code
}

// Получить флаг языка
export function getLanguageFlag(code: string): string {
  const config = getLanguageConfig(code)
  return config ? config.flag : '🌐'
}

// Создать объект с переводами для всех языков
export function createEmptyTranslations(): Record<string, string> {
  const translations: Record<string, string> = {}
  
  for (const lang of SUPPORTED_LANGUAGES) {
    translations[lang.code] = ''
  }
  
  return translations
}

// Валидация кода языка
export function validateLanguageCode(code: string): code is Locale {
  return isLanguageSupported(code)
}

// Получить список языков для селекта
export function getLanguageOptions(): Array<{ value: string; label: string; flag: string }> {
  return SUPPORTED_LANGUAGES.map(lang => ({
    value: lang.code,
    label: lang.name,
    flag: lang.flag
  }))
}
