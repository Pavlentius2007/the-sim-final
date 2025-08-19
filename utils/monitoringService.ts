interface LogEntry {
  timestamp: Date
  level: 'info' | 'warn' | 'error' | 'debug'
  message: string
  context?: string
  data?: any
}

interface SystemStats {
  uptime: number
  totalLogs: number
  metricsCount: number
  memoryUsage: {
    heapUsed: number
    heapTotal: number
    external: number
    rss: number
  }
  startTime: string
}

interface PerformanceReport {
  summary: {
    totalRequests: number
    averageResponseTime: number
    errorRate: number
    uptime: number
  }
  details: {
    metrics: Record<string, number>
    recentErrors: LogEntry[]
    topEndpoints: Array<{ endpoint: string; count: number }>
  }
}

class MonitoringService {
  private logs: LogEntry[] = []
  private metrics: Record<string, number> = {}
  private startTime: Date = new Date()

  // Логирование
  info(message: string, context?: string, data?: any): void {
    this.addLog('info', message, context, data)
  }

  warn(message: string, context?: string, data?: any): void {
    this.addLog('warn', message, context, data)
  }

  error(message: string, context?: string, data?: any): void {
    this.addLog('error', message, context, data)
  }

  debug(message: string, context?: string, data?: any): void {
    this.addLog('debug', message, context, data)
  }

  private addLog(level: LogEntry['level'], message: string, context?: string, data?: any): void {
    const logEntry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      context,
      data
    }

    this.logs.push(logEntry)
    
    // Ограничиваем количество логов
    if (this.logs.length > 1000) {
      this.logs = this.logs.slice(-500)
    }

    // Выводим в консоль
    const timestamp = logEntry.timestamp.toISOString()
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`
    const contextStr = context ? ` [${context}]` : ''
    
    switch (level) {
      case 'error':
        console.error(`${prefix}${contextStr} ${message}`, data || '')
        break
      case 'warn':
        console.warn(`${prefix}${contextStr} ${message}`, data || '')
        break
      case 'debug':
        console.debug(`${prefix}${contextStr} ${message}`, data || '')
        break
      default:
        console.log(`${prefix}${contextStr} ${message}`, data || '')
    }
  }

  // Метрики
  incrementMetric(name: string, value: number = 1): void {
    this.metrics[name] = (this.metrics[name] || 0) + value
  }

  setMetric(name: string, value: number): void {
    this.metrics[name] = value
  }

  getMetric(name: string): number {
    return this.metrics[name] || 0
  }

  getAllMetrics(): Record<string, number> {
    return { ...this.metrics }
  }

  clearMetrics(): void {
    this.metrics = {}
  }

  // Логи
  getLogs(level?: LogEntry['level'], limit: number = 50): LogEntry[] {
    let filteredLogs = this.logs

    if (level) {
      filteredLogs = this.logs.filter(log => log.level === level)
    }

    return filteredLogs.slice(-limit)
  }

  clearLogs(): void {
    this.logs = []
  }

  // Статистика системы
  getSystemStats(): SystemStats {
    const uptime = Date.now() - this.startTime.getTime()
    const memUsage = process.memoryUsage()

    return {
      uptime,
      totalLogs: this.logs.length,
      metricsCount: Object.keys(this.metrics).length,
      memoryUsage: {
        heapUsed: memUsage.heapUsed,
        heapTotal: memUsage.heapTotal,
        external: memUsage.external,
        rss: memUsage.rss
      },
      startTime: this.startTime.toISOString()
    }
  }

  // Отчет о производительности
  generatePerformanceReport(): PerformanceReport {
    const uptime = Date.now() - this.startTime.getTime()
    const totalRequests = this.getMetric('total_requests') || 0
    const totalErrors = this.getMetric('total_errors') || 0
    const totalResponseTime = this.getMetric('total_response_time') || 0

    const recentErrors = this.getLogs('error', 10)
    const topEndpoints = Object.entries(this.metrics)
      .filter(([key]) => key.startsWith('endpoint_'))
      .map(([key, count]) => ({
        endpoint: key.replace('endpoint_', ''),
        count: count as number
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    return {
      summary: {
        totalRequests,
        averageResponseTime: totalRequests > 0 ? totalResponseTime / totalRequests : 0,
        errorRate: totalRequests > 0 ? (totalErrors / totalRequests) * 100 : 0,
        uptime
      },
      details: {
        metrics: this.getAllMetrics(),
        recentErrors,
        topEndpoints
      }
    }
  }
}

export const monitoringService = new MonitoringService()
