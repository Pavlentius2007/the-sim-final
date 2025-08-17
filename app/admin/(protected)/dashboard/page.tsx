'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  Globe, 
  FileText, 
  Activity, 
  Clock,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

interface DashboardStats {
  totalLeads: number
  totalTranslations: number
  activeLanguages: number
  systemHealth: 'good' | 'warning' | 'error'
  lastLeadTime?: string
  popularLanguages: Array<{ code: string; count: number }>
  recentActivity: Array<{ type: string; message: string; time: string }>
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      // Загружаем данные с разных API параллельно
      const [leadsRes, translationsRes, monitoringRes, systemRes] = await Promise.all([
        fetch('/api/leads?limit=1000'), // Загружаем все заявки для статистики
        fetch('/api/translations'),
        fetch('/api/monitoring?action=stats'),
        fetch('/api/settings/system-info')
      ])

      const leadsData = await leadsRes.json()
      const translationsData = await translationsRes.json()
      const _monitoringData = await monitoringRes.json()
      const systemData = await systemRes.json()

      // Обрабатываем данные заявок
      const leadsStats = leadsData.success ? leadsData.stats : {
        total: 0, new: 0, contacted: 0, qualified: 0, converted: 0, lost: 0
      }

      // Определяем здоровье системы
      let systemHealth: 'good' | 'warning' | 'error' = 'good'
      if (systemData.success && systemData.data.memory) {
        const memoryUsage = (systemData.data.memory.used / systemData.data.memory.total) * 100
        if (memoryUsage > 90) {
          systemHealth = 'error'
        } else if (memoryUsage > 70) {
          systemHealth = 'warning'
        }
      }

      // Формируем активность по языкам из заявок
      const languageStats: Record<string, number> = {}
      if (leadsData.success && leadsData.data) {
        leadsData.data.forEach((lead: Record<string, unknown>) => {
          const lang = (lead.language as string) || 'ru'
          languageStats[lang] = (languageStats[lang] || 0) + 1
        })
      }

      const popularLanguages = Object.entries(languageStats)
        .map(([code, count]) => ({ code, count: count as number }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 4)

      // Формируем недавнюю активность
      const recentActivity = []
      
      // Добавляем недавние заявки
      if (leadsData.success && leadsData.data) {
        const recentLeads = leadsData.data
          .sort((a: Record<string, unknown>, b: Record<string, unknown>) => new Date((b.createdAt as string)).getTime() - new Date((a.createdAt as string)).getTime())
          .slice(0, 3)
        
        recentLeads.forEach((lead: Record<string, unknown>) => {
          const timeAgo = getTimeAgo(lead.createdAt as string)
          recentActivity.push({
            type: 'lead',
            message: `Новая заявка от ${lead.name}`,
            time: timeAgo
          })
        })
      }

      // Добавляем системную активность
      if (systemData.success) {
        recentActivity.push({
          type: 'system',
          message: 'Система работает стабильно',
          time: 'только что'
        })
      }

      setStats({
        totalLeads: leadsStats.total || 0,
        totalTranslations: translationsData.success ? translationsData.data?.length || 0 : 0,
        activeLanguages: popularLanguages.length,
        systemHealth,
        lastLeadTime: leadsData.success && leadsData.data.length > 0 
          ? getTimeAgo(leadsData.data[0].createdAt) 
          : undefined,
        popularLanguages,
        recentActivity: recentActivity.slice(0, 5)
      })
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      setStats({
        totalLeads: 0,
        totalTranslations: 0,
        activeLanguages: 0,
        systemHealth: 'error',
        popularLanguages: [],
        recentActivity: []
      })
    } finally {
      setLoading(false)
    }
  }

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'good':
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-400" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-400" />
      default:
        return <Activity className="w-5 h-5 text-gray-400" />
    }
  }

  const getHealthText = (health: string) => {
    switch (health) {
      case 'good':
        return 'Отлично'
      case 'warning':
        return 'Внимание'
      case 'error':
        return 'Критично'
      default:
        return 'Неизвестно'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Загрузка дашборда...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Заголовок */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Дашборд</h1>
          <p className="text-gray-400 mt-1">Обзор системы и статистика</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 px-3 py-2 bg-dark-800 rounded-lg">
            {getHealthIcon(stats?.systemHealth || 'good')}
            <span className="text-sm text-gray-300">
              {getHealthText(stats?.systemHealth || 'good')}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Основная статистика */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {/* Заявки */}
        <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Всего заявок</p>
              <p className="text-3xl font-bold text-white">{stats?.totalLeads || 0}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>

        {/* Переводы */}
        <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Переводов</p>
              <p className="text-3xl font-bold text-white">{stats?.totalTranslations || 0}</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>

        {/* Языки */}
        <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Активных языков</p>
              <p className="text-3xl font-bold text-white">{stats?.activeLanguages || 0}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Globe className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Последняя активность */}
        <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Последняя заявка</p>
              <p className="text-lg font-semibold text-white">
                {stats?.lastLeadTime || 'Нет данных'}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-400" />
            </div>
          </div>
        </div>
      </motion.div>



      {/* Популярные языки и активность */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Популярные языки */}
        <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
          <h3 className="text-xl font-semibold text-white mb-4">Популярные языки</h3>
          <div className="space-y-3">
            {stats?.popularLanguages.map((lang, _index) => (
              <div key={lang.code} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getLanguageFlag(lang.code)}</span>
                  <span className="text-white">{getLanguageName(lang.code)}</span>
                </div>
                <span className="text-gray-400">{lang.count} заявок</span>
              </div>
            ))}
            {(!stats?.popularLanguages || stats.popularLanguages.length === 0) && (
              <p className="text-gray-400 text-center py-4">Нет данных</p>
            )}
          </div>
        </div>

        {/* Недавняя активность */}
        <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
          <h3 className="text-xl font-semibold text-white mb-4">Недавняя активность</h3>
          <div className="space-y-3">
            {stats?.recentActivity.map((activity, _index) => (
              <div key={_index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-white text-sm">{activity.message}</p>
                  <p className="text-gray-400 text-xs">{activity.time}</p>
                </div>
              </div>
            ))}
            {(!stats?.recentActivity || stats.recentActivity.length === 0) && (
              <p className="text-gray-400 text-center py-4">Нет активности</p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function getLanguageFlag(code: string): string {
  const flags: Record<string, string> = {
    'ru': '🇷🇺',
    'en': '🇺🇸',
    'zh': '🇨🇳',
    'th': '🇹🇭',
    'es': '🇪🇸',
    'fr': '🇫🇷',
    'de': '🇩🇪',
    'ja': '🇯🇵',
    'ko': '🇰🇷'
  }
  return flags[code] || '🌐'
}

function getLanguageName(code: string): string {
  const names: Record<string, string> = {
    'ru': 'Русский',
    'en': 'English',
    'zh': '中文',
    'th': 'ไทย',
    'es': 'Español',
    'fr': 'Français',
    'de': 'Deutsch',
    'ja': '日本語',
    'ko': '한국어'
  }
  return names[code] || code.toUpperCase()
}

function getTimeAgo(dateString: string): string {
  const now = new Date()
  const date = new Date(dateString)
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'только что'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} мин. назад`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} ч. назад`
  } else {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} дн. назад`
  }
}
