'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Play, 
  Pause, 
  RefreshCw, 
  Settings, 
  Clock, 
  Globe, 
  Save, 
  CheckCircle,
  AlertCircle,
  Loader
} from 'lucide-react'

interface AutoUpdateConfig {
  enabled: boolean
  interval: number
  languages: string[]
  autoSave: boolean
  notifyOnUpdate: boolean
}

interface AutoUpdateStatus {
  isRunning: boolean
  lastUpdate?: Date
}

interface UpdateResult {
  success: boolean
  updatedKeys: string[]
  newTranslations: number
  errors: string[]
  timestamp: Date
}

export default function AutoUpdateManager() {
  const [config, setConfig] = useState<AutoUpdateConfig>({
    enabled: true,
    interval: 30 * 60 * 1000, // 30 минут
    languages: ['en', 'zh', 'th'],
    autoSave: true,
    notifyOnUpdate: true
  })
  
  const [status, setStatus] = useState<AutoUpdateStatus>({
    isRunning: false
  })
  
  const [lastResult, setLastResult] = useState<UpdateResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  // Загрузка статуса при монтировании
  useEffect(() => {
    if (typeof window !== 'undefined') {
      loadStatus()
    }
  }, [])

  const loadStatus = async () => {
    try {
      const response = await fetch('/api/auto-update')
      const data = await response.json()
      
      if (data.success) {
        setStatus(data.data.status)
        setConfig(data.data.config)
      }
    } catch (error) {
      console.error('Ошибка загрузки статуса:', error)
    }
  }

  const handleAction = async (action: string, configData?: Partial<AutoUpdateConfig>) => {
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/auto-update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          config: configData
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setMessage(data.message)
        
        if (action === 'force-update' && data.data) {
          setLastResult(data.data)
        }
        
        // Обновляем статус
        await loadStatus()
      } else {
        setMessage(`Ошибка: ${data.error}`)
      }
    } catch (error) {
      setMessage(`Ошибка: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const formatInterval = (ms: number): string => {
    const minutes = Math.floor(ms / (1000 * 60))
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    
    if (days > 0) return `${days} дн.`
    if (hours > 0) return `${hours} ч.`
    return `${minutes} мин.`
  }

  const formatDate = (date?: Date): string => {
    if (!date) return 'Никогда'
    return new Date(date).toLocaleString('ru-RU')
  }

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Автоматическое обновление переводов
          </h2>
          <p className="text-gray-400">
            Автоматическое добавление недостающих переводов
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${status.isRunning ? 'bg-green-500' : 'bg-gray-500'}`}></div>
          <span className="text-sm text-gray-400">
            {status.isRunning ? 'Работает' : 'Остановлено'}
          </span>
        </div>
      </div>

      {/* Сообщения */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl flex items-center space-x-3 ${
            message.includes('Ошибка') 
              ? 'bg-red-500/20 border border-red-500/30' 
              : 'bg-green-500/20 border border-green-500/30'
          }`}
        >
          {message.includes('Ошибка') ? (
            <AlertCircle className="w-5 h-5 text-red-400" />
          ) : (
            <CheckCircle className="w-5 h-5 text-green-400" />
          )}
          <span className={message.includes('Ошибка') ? 'text-red-400' : 'text-green-400'}>
            {message}
          </span>
        </motion.div>
      )}

      {/* Управление */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleAction(status.isRunning ? 'stop' : 'start')}
          disabled={loading}
          className={`p-4 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-all ${
            status.isRunning
              ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
              : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
          } disabled:opacity-50`}
        >
          {loading ? (
            <Loader className="w-5 h-5 animate-spin" />
          ) : status.isRunning ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5" />
          )}
          <span>{status.isRunning ? 'Остановить' : 'Запустить'}</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleAction('force-update')}
          disabled={loading}
          className="p-4 rounded-xl font-semibold bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
        >
          {loading ? (
            <Loader className="w-5 h-5 animate-spin" />
          ) : (
            <RefreshCw className="w-5 h-5" />
          )}
          <span>Принудительное обновление</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleAction('update-config', config)}
          disabled={loading}
          className="p-4 rounded-xl font-semibold bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
        >
          <Settings className="w-5 h-5" />
          <span>Сохранить настройки</span>
        </motion.button>
      </div>

      {/* Конфигурация */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <Settings className="w-5 h-5" />
          <span>Настройки</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Интервал */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-300 mb-2">
              <Clock className="w-4 h-4" />
              <span>Интервал обновления</span>
            </label>
            <select
              value={config.interval}
              onChange={(e) => setConfig({ ...config, interval: Number(e.target.value) })}
              className="w-full px-4 py-2 bg-dark-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value={5 * 60 * 1000}>5 минут</option>
              <option value={15 * 60 * 1000}>15 минут</option>
              <option value={30 * 60 * 1000}>30 минут</option>
              <option value={60 * 60 * 1000}>1 час</option>
              <option value={2 * 60 * 60 * 1000}>2 часа</option>
              <option value={6 * 60 * 60 * 1000}>6 часов</option>
              <option value={24 * 60 * 60 * 1000}>24 часа</option>
            </select>
          </div>

          {/* Языки */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-300 mb-2">
              <Globe className="w-4 h-4" />
              <span>Языки для обновления</span>
            </label>
            <div className="space-y-2">
              {['en', 'zh', 'th'].map((lang) => (
                <label key={lang} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={config.languages.includes(lang)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setConfig({ ...config, languages: [...config.languages, lang] })
                      } else {
                        setConfig({ ...config, languages: config.languages.filter(l => l !== lang) })
                      }
                    }}
                    className="w-4 h-4 text-primary-500 bg-dark-700 border-gray-600 rounded focus:ring-primary-500"
                  />
                  <span className="text-gray-300">{lang.toUpperCase()}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Автосохранение */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-300 mb-2">
              <Save className="w-4 h-4" />
              <span>Автосохранение</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={config.autoSave}
                onChange={(e) => setConfig({ ...config, autoSave: e.target.checked })}
                className="w-4 h-4 text-primary-500 bg-dark-700 border-gray-600 rounded focus:ring-primary-500"
              />
              <span className="text-gray-300">Автоматически сохранять новые переводы</span>
            </label>
          </div>

          {/* Уведомления */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-300 mb-2">
              <span>Уведомления</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={config.notifyOnUpdate}
                onChange={(e) => setConfig({ ...config, notifyOnUpdate: e.target.checked })}
                className="w-4 h-4 text-primary-500 bg-dark-700 border-gray-600 rounded focus:ring-primary-500"
              />
              <span className="text-gray-300">Уведомлять об обновлениях</span>
            </label>
          </div>
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-2xl font-bold gradient-text mb-1">
            {formatInterval(config.interval)}
          </div>
          <div className="text-sm text-gray-400">Интервал обновления</div>
        </div>
        
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-2xl font-bold gradient-text mb-1">
            {config.languages.length}
          </div>
          <div className="text-sm text-gray-400">Языков</div>
        </div>
        
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-2xl font-bold gradient-text mb-1">
            {formatDate(status.lastUpdate)}
          </div>
          <div className="text-sm text-gray-400">Последнее обновление</div>
        </div>
      </div>

      {/* Результаты последнего обновления */}
      {lastResult && (
        <div className="glass rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Результаты последнего обновления
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold gradient-text mb-1">
                {lastResult.newTranslations}
              </div>
              <div className="text-sm text-gray-400">Новых переводов</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold gradient-text mb-1">
                {lastResult.updatedKeys.length}
              </div>
              <div className="text-sm text-gray-400">Обновленных ключей</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold gradient-text mb-1">
                {lastResult.errors.length}
              </div>
              <div className="text-sm text-gray-400">Ошибок</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold gradient-text mb-1">
                {formatDate(lastResult.timestamp)}
              </div>
              <div className="text-sm text-gray-400">Время выполнения</div>
            </div>
          </div>

          {lastResult.errors.length > 0 && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4">
              <h4 className="text-red-400 font-semibold mb-2">Ошибки:</h4>
              <ul className="space-y-1">
                {lastResult.errors.map((error, index) => (
                  <li key={index} className="text-red-400 text-sm">• {error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
} 