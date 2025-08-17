'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertCircle, Info, X, AlertTriangle } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastProps {
  toast: Toast
  onRemove: (id: string) => void
}

const ToastComponent = ({ toast, onRemove }: ToastProps) => {
  const [isRemoving, setIsRemoving] = useState(false)

  useEffect(() => {
    if (toast.duration !== 0) {
      const timer = setTimeout(() => {
        setIsRemoving(true)
        setTimeout(() => onRemove(toast.id), 300)
      }, toast.duration || 5000)

      return () => clearTimeout(timer)
    }
  }, [toast.id, toast.duration, onRemove])

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-400" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />
      case 'info':
        return <Info className="w-5 h-5 text-blue-400" />
    }
  }

  const getColors = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-500/10 border-green-500/20 shadow-green-500/10'
      case 'error':
        return 'bg-red-500/10 border-red-500/20 shadow-red-500/10'
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/20 shadow-yellow-500/10'
      case 'info':
        return 'bg-blue-500/10 border-blue-500/20 shadow-blue-500/10'
    }
  }

  const handleRemove = () => {
    setIsRemoving(true)
    setTimeout(() => onRemove(toast.id), 300)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ 
        opacity: isRemoving ? 0 : 1, 
        y: isRemoving ? -50 : 0, 
        scale: isRemoving ? 0.9 : 1 
      }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`
        relative max-w-sm w-full bg-dark-800 border rounded-xl shadow-lg backdrop-blur-sm
        ${getColors()}
      `}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <div className="ml-3 w-0 flex-1">
            <h4 className="text-sm font-medium text-white">
              {toast.title}
            </h4>
            {toast.message && (
              <p className="mt-1 text-sm text-gray-300">
                {toast.message}
              </p>
            )}
            {toast.action && (
              <div className="mt-3">
                <button
                  onClick={toast.action.onClick}
                  className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
                >
                  {toast.action.label}
                </button>
              </div>
            )}
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={handleRemove}
              className="inline-flex text-gray-400 hover:text-gray-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Progress bar for duration */}
      {toast.duration !== 0 && (
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-bl-xl"
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: (toast.duration || 5000) / 1000, ease: 'linear' }}
        />
      )}
    </motion.div>
  )
}

interface ToastContainerProps {
  toasts: Toast[]
  onRemove: (id: string) => void
}

export const ToastContainer = ({ toasts, onRemove }: ToastContainerProps) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-3">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastComponent
            key={toast.id}
            toast={toast}
            onRemove={onRemove}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

// Hook для управления уведомлениями
export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast: Toast = {
      id,
      duration: 5000, // По умолчанию 5 секунд
      ...toast
    }
    setToasts((prev) => [...prev, newToast])
    return id
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  const clearToasts = () => {
    setToasts([])
  }

  // Функции-хелперы для разных типов уведомлений
  const success = (title: string, message?: string, options?: Partial<Toast>) =>
    addToast({ type: 'success', title, message, ...options })

  const error = (title: string, message?: string, options?: Partial<Toast>) =>
    addToast({ type: 'error', title, message, duration: 7000, ...options })

  const warning = (title: string, message?: string, options?: Partial<Toast>) =>
    addToast({ type: 'warning', title, message, ...options })

  const info = (title: string, message?: string, options?: Partial<Toast>) =>
    addToast({ type: 'info', title, message, ...options })

  // Специальные уведомления для типичных операций
  const apiSuccess = (operation: string, details?: string) =>
    success(`${operation} выполнено`, details)

  const apiError = (operation: string, errorMessage?: string) =>
    error(`Ошибка: ${operation}`, errorMessage || 'Попробуйте еще раз или обратитесь к администратору')

  const validationError = (message: string) =>
    warning('Ошибка валидации', message)

  const networkError = () =>
    error('Ошибка сети', 'Проверьте подключение к интернету и попробуйте еще раз')

  return {
    toasts,
    addToast,
    removeToast,
    clearToasts,
    success,
    error,
    warning,
    info,
    apiSuccess,
    apiError,
    validationError,
    networkError
  }
}

export default ToastComponent











