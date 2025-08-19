'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Activity, 
  BarChart3, 
  FileText, 
  Settings, 
  RefreshCw, 
  Trash2, 
  Send, 
  Bell,
  CheckCircle,
  XCircle,
  AlertTriangle as _AlertTriangle,
  Clock,
  HardDrive,
  Cpu
} from 'lucide-react'

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

interface HealthStatus {
  telegram: boolean
  translate: boolean
  system: boolean
}

export default function MonitoringPanel() {
  const [stats, setStats] = useState<SystemStats | null>(null)
  const [metrics, setMetrics] = useState<Record<string, number>>({})
  const [logs, setLogs] = useState<Record<string, unknown>[]>([])
  const [health, setHealth] = useState<HealthStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'metrics' | 'logs' | 'health'>('overview')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      loadData()
    }
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [statsRes, metricsRes, logsRes, healthRes] = await Promise.all([
        fetch('/api/monitoring?action=stats'),
        fetch('/api/monitoring?action=metrics'),
        fetch('/api/monitoring?action=logs&limit=20'),
        fetch('/api/monitoring?action=health')
      ])

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData.data)
      }

      if (metricsRes.ok) {
        const metricsData = await metricsRes.json()
        setMetrics(metricsData.data)
      }

      if (logsRes.ok) {
        const logsData = await logsRes.json()
        setLogs(logsData.data)
      }

      if (healthRes.ok) {
        const healthData = await healthRes.json()
        setHealth(healthData.data)
      }
    } catch (error) {
      console.error('Ошибка загрузки данных мониторинга:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (action: string) => {
    setLoading(true)
    try {
      const response = await fetch('/api/monitoring', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      })

      if (response.ok) {
        const result = await response.json()
        alert(result.message)
        if (action === 'clear-logs') {
          setLogs([])
        } else if (action === 'clear-metrics') {
          setMetrics({})
        }
      }
    } catch (error) {
      console.error('Ошибка выполнения действия:', error)
      alert('Ошибка выполнения действия')
    } finally {
      setLoading(false)
    }
  }

  const formatUptime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60))
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}ч ${minutes}м`
  }

  const formatBytes = (bytes: number) => {
    const mb = bytes / (1024 * 1024)
    return `${mb.toFixed(1)} MB`
  }

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case 'ERROR': return 'text-red-500'
      case 'WARN': return 'text-yellow-500'
      case 'INFO': return 'text-blue-500'
      case 'DEBUG': return 'text-gray-500'
      default: return 'text-gray-400'
    }
  }

  const getHealthIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="w-5 h-5 text-green-500" />
    ) : (
      <XCircle className="w-5 h-5 text-red-500" />
    )
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Activity className="w-6 h-6" />
          Мониторинг системы
        </h2>
        <button
          onClick={loadData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Обновить
        </button>
      </div>

      {/* Табы */}
      <div className="flex gap-2 mb-6">
        {[
          { id: 'overview', label: 'Обзор', icon: BarChart3 },
          { id: 'metrics', label: 'Метрики', icon: Activity },
          { id: 'logs', label: 'Логи', icon: FileText },
          { id: 'health', label: 'Здоровье', icon: Settings }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'overview' | 'metrics' | 'logs' | 'health')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Контент табов */}
      <div className="min-h-[400px]">
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {/* Статистика системы */}
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-blue-400" />
                <span className="text-gray-300">Время работы</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {stats ? formatUptime(stats.uptime) : '...'}
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-green-400" />
                <span className="text-gray-300">Всего логов</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {stats?.totalLogs || 0}
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-5 h-5 text-purple-400" />
                <span className="text-gray-300">Метрик</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {stats?.metricsCount || 0}
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <HardDrive className="w-5 h-5 text-yellow-400" />
                <span className="text-gray-300">Память</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {stats?.memoryUsage ? formatBytes(stats.memoryUsage.heapUsed) : '...'}
              </div>
            </div>

            {/* Действия */}
            <div className="md:col-span-2 lg:col-span-4 bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Действия</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleAction('clear-logs')}
                  className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                  Очистить логи
                </button>
                <button
                  onClick={() => handleAction('clear-metrics')}
                  className="flex items-center gap-2 px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  <Trash2 className="w-4 h-4" />
                  Очистить метрики
                </button>
                <button
                  onClick={() => handleAction('send-report')}
                  className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Send className="w-4 h-4" />
                  Отправить отчет
                </button>
                <button
                  onClick={() => handleAction('test-notification')}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Bell className="w-4 h-4" />
                  Тест уведомления
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'metrics' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 rounded-lg p-4"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Метрики системы</h3>
            {Object.keys(metrics).length === 0 ? (
              <p className="text-gray-400">Метрики отсутствуют</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(metrics).map(([key, value]) => (
                  <div key={key} className="bg-gray-700 rounded-lg p-3">
                    <div className="text-sm text-gray-400 mb-1">{key}</div>
                    <div className="text-xl font-bold text-white">{value}</div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'logs' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 rounded-lg p-4"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Последние логи</h3>
            {logs.length === 0 ? (
              <p className="text-gray-400">Логи отсутствуют</p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {logs.map((log, index) => (
                  <div key={index} className="bg-gray-700 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-mono ${getLogLevelColor(log.level as string)}`}>
                        {log.level as string}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(log.timestamp as string).toLocaleString('ru-RU')}
                      </span>
                    </div>
                    <div className="text-white text-sm">{log.message as string}</div>
                    {log.context != null && (
                      <div className="text-xs text-gray-400 mt-1">Контекст: {String(log.context)}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'health' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 rounded-lg p-4"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Состояние системы</h3>
            {health ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-blue-400" />
                    <span className="text-white">Telegram Bot</span>
                  </div>
                  {getHealthIcon(health.telegram)}
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Cpu className="w-5 h-5 text-green-400" />
                    <span className="text-white">Google Translate API</span>
                  </div>
                  {getHealthIcon(health.translate)}
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-purple-400" />
                    <span className="text-white">Система мониторинга</span>
                  </div>
                  {getHealthIcon(health.system)}
                </div>
              </div>
            ) : (
              <p className="text-gray-400">Загрузка состояния системы...</p>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
} 