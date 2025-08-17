'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, TrendingUp, Eye, Clock, UserCheck, XCircle } from 'lucide-react'

interface QuickStatusEditProps {
  currentStatus: string
  onStatusChange: (newStatus: string) => void
  onClose: () => void
}

const statusOptions = [
  { value: 'new', label: 'Новая', icon: Clock, color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { value: 'contacted', label: 'Связались', icon: Eye, color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  { value: 'thinking', label: 'Размышляет', icon: Clock, color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  { value: 'investor', label: 'Инвестор', icon: UserCheck, color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' },
  { value: 'converted', label: 'Конвертированная', icon: TrendingUp, color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  { value: 'lost', label: 'Потерянная', icon: XCircle, color: 'bg-red-500/20 text-red-400 border-red-500/30' }
]

export default function QuickStatusEdit({ currentStatus, onStatusChange, onClose }: QuickStatusEditProps) {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus)

  const handleSave = () => {
    if (selectedStatus !== currentStatus) {
      onStatusChange(selectedStatus)
    }
    onClose()
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-dark-800 rounded-xl border border-dark-700 w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Заголовок */}
          <div className="flex items-center justify-between p-4 border-b border-dark-700">
            <h3 className="text-lg font-semibold text-white">Изменить статус</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Опции статуса */}
          <div className="p-4 space-y-3">
            {statusOptions.map((option) => {
              const Icon = option.icon
              const isSelected = selectedStatus === option.value
              
              return (
                <button
                  key={option.value}
                  onClick={() => setSelectedStatus(option.value)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg border transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-dark-600 hover:border-dark-500 hover:bg-dark-700/50'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    isSelected ? 'border-blue-500 bg-blue-500' : 'border-dark-500'
                  }`}>
                    {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                  </div>
                  <Icon className={`w-5 h-5 ${
                    isSelected ? 'text-blue-400' : 'text-gray-400'
                  }`} />
                  <span className={`font-medium ${
                    isSelected ? 'text-blue-400' : 'text-white'
                  }`}>
                    {option.label}
                  </span>
                  {isSelected && (
                    <span className={`ml-auto px-2 py-1 text-xs rounded-full border ${option.color}`}>
                      Текущий
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Кнопки */}
          <div className="flex items-center justify-end space-x-3 p-4 border-t border-dark-700">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Отмена
            </button>
            <button
              onClick={handleSave}
              disabled={selectedStatus === currentStatus}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check className="w-4 h-4" />
              <span>Сохранить</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
