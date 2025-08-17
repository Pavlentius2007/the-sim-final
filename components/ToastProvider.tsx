'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useToast, ToastContainer, Toast } from './Toast'

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => string
  removeToast: (id: string) => void
  clearToasts: () => void
  success: (title: string, message?: string, options?: Partial<Toast>) => string
  error: (title: string, message?: string, options?: Partial<Toast>) => string
  warning: (title: string, message?: string, options?: Partial<Toast>) => string
  info: (title: string, message?: string, options?: Partial<Toast>) => string
  apiSuccess: (operation: string, details?: string) => string
  apiError: (operation: string, errorMessage?: string) => string
  validationError: (message: string) => string
  networkError: () => string
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const useToastContext = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider')
  }
  return context
}

interface ToastProviderProps {
  children: ReactNode
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const toastHook = useToast()

  return (
    <ToastContext.Provider value={toastHook}>
      {children}
      <ToastContainer toasts={toastHook.toasts} onRemove={toastHook.removeToast} />
    </ToastContext.Provider>
  )
}

export default ToastProvider











