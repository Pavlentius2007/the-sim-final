// Типы ошибок
export enum ErrorType {
  NETWORK = 'NETWORK',
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  SERVER = 'SERVER',
  CLIENT = 'CLIENT',
  UNKNOWN = 'UNKNOWN'
}

export interface AppError {
  type: ErrorType
  message: string
  details?: string
  code?: string | number
  field?: string
  originalError?: Error
  timestamp: string
  context?: Record<string, any>
}

// Создание ошибки
export const createError = (
  type: ErrorType,
  message: string,
  options?: Partial<Omit<AppError, 'type' | 'message' | 'timestamp'>>
): AppError => ({
  type,
  message,
  timestamp: new Date().toISOString(),
  ...options
})

// Определение типа ошибки по HTTP статусу
export const getErrorTypeFromStatus = (status: number): ErrorType => {
  if (status >= 400 && status < 500) {
    switch (status) {
      case 401:
        return ErrorType.AUTHENTICATION
      case 403:
        return ErrorType.AUTHORIZATION
      case 422:
        return ErrorType.VALIDATION
      default:
        return ErrorType.CLIENT
    }
  } else if (status >= 500) {
    return ErrorType.SERVER
  } else {
    return ErrorType.UNKNOWN
  }
}

// Парсинг ошибки от API
export const parseApiError = async (response: Response): Promise<AppError> => {
  const status = response.status
  const type = getErrorTypeFromStatus(status)
  
  try {
    const data = await response.json()
    
    return createError(type, data.error || data.message || 'Неизвестная ошибка', {
      code: status,
      details: data.details || data.description,
      field: data.field,
      context: { url: response.url, status }
    })
  } catch (parseError) {
    return createError(type, response.statusText || 'Ошибка сервера', {
      code: status,
      context: { url: response.url, status }
    })
  }
}

// Парсинг ошибки сети
export const parseNetworkError = (error: Error): AppError => {
  return createError(ErrorType.NETWORK, 'Ошибка сети', {
    details: 'Проверьте подключение к интернету и попробуйте еще раз',
    originalError: error,
    context: { name: error.name }
  })
}

// Обработчик для fetch запросов
export const handleApiResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = await parseApiError(response)
    throw error
  }
  
  try {
    const data = await response.json()
    return data
  } catch (parseError) {
    throw createError(ErrorType.CLIENT, 'Ошибка парсинга ответа', {
      details: 'Сервер вернул некорректный JSON',
      originalError: parseError as Error
    })
  }
}

// Wrapper для fetch с обработкой ошибок
export const apiRequest = async <T>(
  url: string,
  options?: RequestInit
): Promise<T> => {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      },
      ...options
    })
    
    return await handleApiResponse<T>(response)
  } catch (error) {
    if (error instanceof TypeError || (error as any).message?.includes('fetch')) {
      throw parseNetworkError(error as Error)
    }
    throw error
  }
}

// Класс для централизованного логирования ошибок
export class ErrorLogger {
  private static instance: ErrorLogger
  private logs: AppError[] = []
  private maxLogs = 100

  static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger()
    }
    return ErrorLogger.instance
  }

  log(error: AppError): void {
    // Добавляем в локальные логи
    this.logs.unshift(error)
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs)
    }

    // Консоль для разработки
    if (process.env.NODE_ENV === 'development') {
      console.group(`🚨 ${error.type} Error`)
      console.error('Message:', error.message)
      if (error.details) console.info('Details:', error.details)
      if (error.code) console.info('Code:', error.code)
      if (error.field) console.info('Field:', error.field)
      if (error.context) console.info('Context:', error.context)
      if (error.originalError) console.error('Original:', error.originalError)
      console.groupEnd()
    }

    // Отправка в внешний сервис логирования (в продакшене)
    if (process.env.NODE_ENV === 'production') {
      this.sendToLoggingService(error).catch(console.error)
    }
  }

  private async sendToLoggingService(error: AppError): Promise<void> {
    try {
      // Здесь можно интегрировать с сервисами типа Sentry, LogRocket и т.д.
      await fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(error)
      })
    } catch (sendError) {
      console.error('Failed to send error to logging service:', sendError)
    }
  }

  getLogs(): AppError[] {
    return [...this.logs]
  }

  clearLogs(): void {
    this.logs = []
  }

  getLogsByType(type: ErrorType): AppError[] {
    return this.logs.filter(log => log.type === type)
  }

  getRecentLogs(minutes: number = 30): AppError[] {
    const cutoff = new Date(Date.now() - minutes * 60 * 1000)
    return this.logs.filter(log => new Date(log.timestamp) > cutoff)
  }
}

// Хук для использования обработки ошибок в компонентах
export const useErrorHandler = () => {
  const logger = ErrorLogger.getInstance()

  const handleError = (error: unknown, context?: Record<string, any>) => {
    let appError: AppError

    if (error && typeof error === 'object' && 'type' in error) {
      // Уже AppError
      appError = error as AppError
    } else if (error instanceof Error) {
      // Обычная ошибка JavaScript
      appError = createError(ErrorType.CLIENT, error.message, {
        originalError: error,
        context
      })
    } else {
      // Неизвестный тип ошибки
      appError = createError(ErrorType.UNKNOWN, 'Неизвестная ошибка', {
        details: String(error),
        context
      })
    }

    logger.log(appError)
    return appError
  }

  const handleApiError = async (response: Response, context?: Record<string, any>) => {
    const error = await parseApiError(response)
    if (context) {
      error.context = { ...error.context, ...context }
    }
    logger.log(error)
    return error
  }

  const handleNetworkError = (error: Error, context?: Record<string, any>) => {
    const appError = parseNetworkError(error)
    if (context) {
      appError.context = { ...appError.context, ...context }
    }
    logger.log(appError)
    return appError
  }

  return {
    handleError,
    handleApiError,
    handleNetworkError,
    logger
  }
}

// Функции-хелперы для быстрого создания ошибок
export const errors = {
  network: (details?: string) => 
    createError(ErrorType.NETWORK, 'Ошибка сети', { details }),
  
  validation: (message: string, field?: string) =>
    createError(ErrorType.VALIDATION, message, { field }),
  
  notFound: (resource: string) =>
    createError(ErrorType.CLIENT, `${resource} не найден`, { code: 404 }),
  
  unauthorized: (details?: string) =>
    createError(ErrorType.AUTHENTICATION, 'Необходима авторизация', { 
      code: 401, 
      details 
    }),
  
  forbidden: (details?: string) =>
    createError(ErrorType.AUTHORIZATION, 'Доступ запрещен', { 
      code: 403, 
      details 
    }),
  
  server: (details?: string) =>
    createError(ErrorType.SERVER, 'Ошибка сервера', { 
      code: 500, 
      details 
    })
}

export default ErrorLogger

