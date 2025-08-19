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

// Загрузка переводов
async function loadMessages(locale: Locale): Promise<Messages> {
  try {
    const messages = await import(`../messages/${locale}.json`)
    return messages.default
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error)
    return {}
  }
}

// Хук для использования переводов
export function useTranslations(locale?: Locale) {
  const contextLocale = useLocale()
  const currentLocale = locale || contextLocale
  
  const [messages, setMessages] = useState<Messages>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadMessagesForLocale = async () => {
      setIsLoading(true)
      const loadedMessages = await loadMessages(currentLocale)
      setMessages(loadedMessages)
      setIsLoading(false)
    }

    loadMessagesForLocale()
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
