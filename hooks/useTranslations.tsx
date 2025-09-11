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

// Кэш для переводов
const messagesCache: Record<Locale, Messages> = {} as Record<Locale, Messages>

// Унифицированная загрузка переводов
function getMessages(locale: Locale): Messages {
  try {
    // Проверяем кэш
    if (messagesCache[locale]) {
      return messagesCache[locale]
    }

    // Загружаем переводы синхронно с проверкой окружения
    let messages: Messages
    if (typeof window === 'undefined') {
      // Серверная среда
      switch (locale) {
        case 'ru':
          messages = require('../messages/ru.json')
          break
        case 'en':
          messages = require('../messages/en.json')
          break
        case 'zh':
          messages = require('../messages/zh.json')
          break
        case 'th':
          messages = require('../messages/th.json')
          break
        default:
          messages = require('../messages/ru.json')
      }
    } else {
      // Клиентская среда
      switch (locale) {
        case 'ru':
          messages = require('../messages/ru.json')
          break
        case 'en':
          messages = require('../messages/en.json')
          break
        case 'zh':
          messages = require('../messages/zh.json')
          break
        case 'th':
          messages = require('../messages/th.json')
          break
        default:
          messages = require('../messages/ru.json')
      }
    }

    // Кэшируем результат
    messagesCache[locale] = messages
    return messages
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error)
    // Возвращаем пустой объект в случае ошибки
    return {}
  }
}

// Хук для использования переводов - синхронная версия для избежания гидратации
export function useTranslations(locale?: Locale) {
  const contextLocale = useLocale()
  const currentLocale = locale || contextLocale
  
  // Загружаем переводы синхронно для консистентности
  const messages = getMessages(currentLocale)

  const t = (key: string, fallback?: string): string => {
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

  return { t, isLoading: false, messages }
}
