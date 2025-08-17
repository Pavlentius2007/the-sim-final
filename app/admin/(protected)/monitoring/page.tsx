'use client'

import { motion } from 'framer-motion'
import { Activity } from 'lucide-react'

export default function AdminMonitoring() {
  return (
    <div className="p-6 space-y-6">
      {/* Заголовок */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Мониторинг</h1>
          <p className="text-gray-400 mt-1">Мониторинг системы</p>
        </div>
      </motion.div>

      {/* Основной контент */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-dark-800 rounded-xl p-6 border border-dark-700"
      >
        <div className="text-center py-12">
          <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Мониторинг системы</h3>
          <p className="text-gray-400">Здесь будет интерфейс для мониторинга системы</p>
        </div>
      </motion.div>
    </div>
  )
}
