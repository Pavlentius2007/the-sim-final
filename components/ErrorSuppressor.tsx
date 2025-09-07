'use client'

import { useEffect } from 'react'

export default function ErrorSuppressor() {
  useEffect(() => {
    // Подавляем ошибки от расширений браузера
    const originalError = window.console.error
    const originalWarn = window.console.warn
    const originalLog = window.console.log

    const shouldSuppress = (message) => {
      const msg = message?.toString() || ''
      return (
        msg.includes('chrome-extension://') ||
        msg.includes('moz-extension://') ||
        msg.includes('safari-extension://') ||
        msg.includes('zmstat.com') ||
        msg.includes('gtmpx.com') ||
        msg.includes('Cannot read properties of null') ||
        msg.includes('message channel closed') ||
        msg.includes('Refused to load the script') ||
        msg.includes('Content Security Policy') ||
        msg.includes('CSP') ||
        msg.includes('Error handling response') ||
        msg.includes('Uncaught (in promise) Error')
      )
    }

    window.console.error = (...args) => {
      if (shouldSuppress(args[0])) {
        return
      }
      originalError.apply(console, args)
    }

    window.console.warn = (...args) => {
      if (shouldSuppress(args[0])) {
        return
      }
      originalWarn.apply(console, args)
    }

    window.console.log = (...args) => {
      if (shouldSuppress(args[0])) {
        return
      }
      originalLog.apply(console, args)
    }

    // Подавляем глобальные ошибки
    const handleError = (event) => {
      if (shouldSuppress(event.message)) {
        event.preventDefault()
        return false
      }
    }

    const handleUnhandledRejection = (event) => {
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
      window.console.warn = originalWarn
      window.console.log = originalLog
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  return null
}
