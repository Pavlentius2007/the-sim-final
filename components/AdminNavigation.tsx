'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  Users, 
  FileText, 
  Settings, 
  Menu, 
  X,
  Home,
  Globe,
  Activity,
  Play
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'



const navigationItems = [
  {
    name: 'Dashboard',
    href: '/admin/dashboard',
    icon: Home,
    description: 'Обзор системы'
  },
  {
    name: 'Заявки',
    href: '/admin/leads',
    icon: Users,
    description: 'Управление заявками'
  },
  {
    name: 'Переводы',
    href: '/admin/translations',
    icon: FileText,
    description: 'Управление переводами'
  },
  {
    name: 'Видео',
    href: '/admin/videos',
    icon: Play,
    description: 'Управление видео'
  },
  {
    name: 'Контент',
    href: '/admin/content',
    icon: Globe,
    description: 'Управление контентом'
  },

  {
    name: 'Мониторинг',
    href: '/admin/monitoring',
    icon: Activity,
    description: 'Мониторинг системы'
  },
  {
    name: 'Настройки',
    href: '/admin/settings',
    icon: Settings,
    description: 'Настройки системы'
  }
]

export default function AdminNavigation() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()
  const { user: _user, logout: _logout } = useAuth()

  return (
    <>
      {/* Мобильная кнопка */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-dark-800 rounded-lg text-white"
      >
        {isCollapsed ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Навигация */}
      <motion.nav
        initial={{ x: -300 }}
        animate={{ x: isCollapsed ? -300 : 0 }}
        className={`fixed lg:relative lg:translate-x-0 z-40 w-80 h-full bg-dark-800 border-r border-dark-700 transition-transform duration-300 ease-in-out`}
      >
        <div className="flex flex-col h-full">
          {/* Логотип */}
          <div className="p-6 border-b border-dark-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold text-blue-500 drop-shadow-sm">TheSim</div>
                <p className="text-sm text-gray-400">Админ панель</p>
              </div>
            </div>
          </div>

          {/* Навигационные элементы */}
          <div className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'text-gray-300 hover:bg-dark-700 hover:text-white'
                  }`}
                  onClick={() => {
                    // Скрываем панель только на мобильных устройствах
                    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                      setIsCollapsed(true)
                    }
                  }}
                >
                  <Icon className={`w-5 h-5 ${
                    isActive ? 'text-blue-400' : 'text-gray-400 group-hover:text-white'
                  }`} />
                  <div className="flex-1">
                    <span className="font-medium">{item.name}</span>
                    <p className="text-xs text-gray-500 group-hover:text-gray-300">
                      {item.description}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Нижняя секция */}
          <div className="p-4 border-t border-dark-700">
            <div className="bg-dark-700 rounded-xl p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Activity className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Статус системы</p>
                  <p className="text-xs text-green-400">Все системы работают</p>
                </div>
              </div>
              <div className="text-xs text-gray-400">
                Последнее обновление: {new Date().toLocaleTimeString('ru-RU')}
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Затемнение для мобильной версии */}
      {isCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsCollapsed(false)}
        />
      )}
    </>
  )
}
