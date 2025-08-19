// Типы для системы переводов

export interface TranslationKey {
  key: string
  value: string
  context?: string
}

export interface LanguageConfig {
  code: string
  name: string
  flag: string
  autoTranslate: boolean
}

export interface TranslationResponse {
  translatedText: string
  originalText: string
  targetLanguage: string
  sourceLanguage: string
}

export interface TranslationError {
  error: string
  message?: string
}

export interface TranslationRequest {
  text: string
  targetLanguage: string
  sourceLanguage?: string
}

// Поддерживаемые языки
export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  { code: 'ru', name: 'Русский', flag: '🇷🇺', autoTranslate: false },
  { code: 'en', name: 'English', flag: '🇺🇸', autoTranslate: true },
  { code: 'zh', name: '中文', flag: '🇨🇳', autoTranslate: true },
  { code: 'th', name: 'ไทย', flag: '🇹🇭', autoTranslate: true },
]

export type Locale = typeof SUPPORTED_LANGUAGES[number]['code']

// Типы для менеджера переводов
export interface TranslationManagerConfig {
  defaultLanguage: string
  fallbackLanguage: string
  autoSave: boolean
  cacheEnabled: boolean
}

export interface TranslationCache {
  [key: string]: {
    [locale: string]: {
      text: string
      timestamp: number
    }
  }
}

export interface VideoData {
  id: string
  title: string
  description: string
  youtubeUrl: string // YouTube ссылка для видео
  thumbnail?: string
  duration: string
  quality: string
  language: string
  languageCode: string
  createdAt: string
  isActive: boolean
  videoType: 'youtube' // Только YouTube тип
}

export interface VideoCollection {
  [languageCode: string]: VideoData[]
}

export interface VideoFormData {
  title: string
  description: string
  youtubeUrl: string
  language: string
  languageCode: string
  duration: string
  quality: string
}
