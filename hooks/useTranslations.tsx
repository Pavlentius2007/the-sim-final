'use client'

import React from 'react'
import { useState, useEffect, createContext, useContext } from 'react'

// Типы для переводов
type Locale = 'ru' | 'en' | 'zh' | 'th'
type Messages = Record<string, any>

// Контекст для локали
const LocaleContext = createContext<Locale>('ru')

// Провайдер контекста
export function LocaleProvider({ 
  children, 
  locale 
}: { 
  children: React.ReactNode
  locale: Locale 
}) {
  return (
    <LocaleContext.Provider value={locale}>
      {children}
    </LocaleContext.Provider>
  )
}

// Хук для получения локали из контекста
export function useLocale() {
  return useContext(LocaleContext)
}

// Унифицированная загрузка переводов
function getMessages(locale: Locale): Messages {
  try {
    // Используем динамический import для обеих сред
    const messages = require(`../messages/${locale}.json`)
    return messages
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error)
    return {}
  }
}

// Хук для использования переводов
export function useTranslations(locale?: Locale) {
  const contextLocale = useLocale()
  const currentLocale = locale || contextLocale
  
  const [messages, setMessages] = useState<Messages>(() => {
    // Загружаем переводы синхронно для обеих сред
    return getMessages(currentLocale)
  })
  
  // Не показываем состояние загрузки - переводы загружаются синхронно
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Обновляем переводы при изменении локали
    const newMessages = getMessages(currentLocale)
    setMessages(newMessages)
  }, [currentLocale])

  const t = (key: string, fallback?: string): string => {
    if (isLoading) return fallback || key
    
    const keys = key.split('.')
    let value: any = messages
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        return fallback || key
      }
    }
    
    return typeof value === 'string' ? value : fallback || key
  }

  return { t, isLoading, messages }
}
