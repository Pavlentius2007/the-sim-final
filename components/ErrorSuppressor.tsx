'use client'

import { useEffect } from 'react'

export default function ErrorSuppressor() {
  useEffect(() => {
    // Подавляем только ошибки от расширений браузера, НЕ ошибки приложения
    if (process.env.NODE_ENV === 'production') {
      return // Не подавляем в продакшене
    }

    const originalError = window.console.error
    
    const shouldSuppress = (message: any) => {
      const msg = message?.toString() || ''
      return (
        // Только ошибки браузерных расширений
        msg.includes('chrome-extension://') ||
        msg.includes('moz-extension://') ||
        msg.includes('safari-extension://') ||
        // Только внешние трекеры
        msg.includes('zmstat.com') ||
        msg.includes('gtmpx.com') ||
        // Только специфичные ошибки расширений
        (msg.includes('Cannot read properties of null (reading \'request\')') && msg.includes('chrome-extension://')) ||
        (msg.includes('message channel closed before a response was received')) ||
        (msg.includes('Refused to load the script') && (msg.includes('zmstat.com') || msg.includes('gtmpx.com'))) ||
        // CSP ошибки только для внешних ресурсов
        ((msg.includes('Content Security Policy') || msg.includes('CSP')) && (msg.includes('zmstat.com') || msg.includes('gtmpx.com'))) ||
        (msg.includes('Error handling response: TypeError') && msg.includes('chrome-extension://'))
      )
    }

    window.console.error = (...args: any[]) => {
      if (shouldSuppress(args[0])) {
        return
      }
      originalError.apply(console, args)
    }

    // Подавляем глобальные ошибки
    const handleError = (event: ErrorEvent) => {
      if (shouldSuppress(event.message)) {
        event.preventDefault()
        return false
      }
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (shouldSuppress(event.reason)) {
        event.preventDefault()
        return false
      }
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    // Восстанавливаем оригинальные функции при размонтировании
    return () => {
      window.console.error = originalError
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  return null
}
