'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, AlertTriangle, AlertCircle, AlertOctagon } from 'lucide-react'

interface QuickPriorityEditProps {
  currentPriority: string
  onPriorityChange: (newPriority: string) => void
  onClose: () => void
}

const priorityOptions = [
  { 
    value: 'low', 
    label: 'Низкий', 
    icon: AlertTriangle, 
    color: 'bg-green-500/20 text-green-400 border-green-500/30',
    description: 'Обычная заявка, можно обработать в течение дня'
  },
  { 
    value: 'medium', 
    label: 'Средний', 
    icon: AlertCircle, 
    color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    description: 'Важная заявка, требует внимания в течение нескольких часов'
  },
  { 
    value: 'high', 
    label: 'Высокий', 
    icon: AlertOctagon, 
    color: 'bg-red-500/20 text-red-400 border-red-500/30',
    description: 'Срочная заявка, требует немедленного внимания'
  }
]

export default function QuickPriorityEdit({ currentPriority, onPriorityChange, onClose }: QuickPriorityEditProps) {
  const [selectedPriority, setSelectedPriority] = useState(currentPriority)

  const handleSave = () => {
    if (selectedPriority !== currentPriority) {
      onPriorityChange(selectedPriority)
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
          className="bg-dark-800 rounded-xl border border-dark-700 w-full max-w-lg"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Заголовок */}
          <div className="flex items-center justify-between p-4 border-b border-dark-700">
            <h3 className="text-lg font-semibold text-white">Изменить приоритет</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Опции приоритета */}
          <div className="p-4 space-y-3">
            {priorityOptions.map((option) => {
              const Icon = option.icon
              const isSelected = selectedPriority === option.value
              
              return (
                <button
                  key={option.value}
                  onClick={() => setSelectedPriority(option.value)}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-dark-600 hover:border-dark-500 hover:bg-dark-700/50'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      isSelected ? 'border-blue-500 bg-blue-500' : 'border-dark-500'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
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
                      </div>
                      <p className={`text-sm ${
                        isSelected ? 'text-blue-300' : 'text-gray-400'
                      }`}>
                        {option.description}
                      </p>
                    </div>
                  </div>
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
              disabled={selectedPriority === currentPriority}
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
