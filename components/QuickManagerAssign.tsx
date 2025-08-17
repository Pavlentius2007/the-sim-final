'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, UserCheck, Search, UserPlus } from 'lucide-react'

interface QuickManagerAssignProps {
  currentManager: string
  onManagerChange: (newManager: string) => void
  onClose: () => void
}

const availableManagers = [
  { id: 'manager1', name: 'Анна Петрова', email: 'anna@company.com', avatar: 'AP' },
  { id: 'manager2', name: 'Михаил Сидоров', email: 'mikhail@company.com', avatar: 'МС' },
  { id: 'manager3', name: 'Елена Козлова', email: 'elena@company.com', avatar: 'ЕК' },
  { id: 'manager4', name: 'Дмитрий Волков', email: 'dmitry@company.com', avatar: 'ДВ' },
  { id: 'manager5', name: 'Ольга Морозова', email: 'olga@company.com', avatar: 'ОМ' }
]

export default function QuickManagerAssign({ currentManager, onManagerChange, onClose }: QuickManagerAssignProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedManager, setSelectedManager] = useState(currentManager)

  const filteredManagers = availableManagers.filter(manager =>
    manager.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    manager.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSave = () => {
    if (selectedManager !== currentManager) {
      onManagerChange(selectedManager)
    }
    onClose()
  }

  const handleUnassign = () => {
    onManagerChange('')
    onClose()
  }

  const getManagerById = (id: string) => availableManagers.find(m => m.id === id)

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
            <h3 className="text-lg font-semibold text-white">Назначить менеджера</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Поиск */}
          <div className="p-4 border-b border-dark-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Поиск менеджера..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Список менеджеров */}
          <div className="max-h-64 overflow-y-auto p-4 space-y-2">
            {filteredManagers.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <UserPlus className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Менеджеры не найдены</p>
              </div>
            ) : (
              filteredManagers.map((manager) => {
                const isSelected = selectedManager === manager.id
                
                return (
                  <button
                    key={manager.id}
                    onClick={() => setSelectedManager(manager.id)}
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
                    
                    <div className="w-8 h-8 bg-dark-600 rounded-full flex items-center justify-center text-sm font-medium text-white">
                      {manager.avatar}
                    </div>
                    
                    <div className="flex-1 text-left">
                      <div className="font-medium text-white">{manager.name}</div>
                      <div className="text-sm text-gray-400">{manager.email}</div>
                    </div>
                    
                    {isSelected && (
                      <span className="px-2 py-1 text-xs rounded-full border bg-blue-500/20 text-blue-400 border-blue-500/30">
                        Выбран
                      </span>
                    )}
                  </button>
                )
              })
            )}
          </div>

          {/* Текущий менеджер */}
          {currentManager && (
            <div className="p-4 border-t border-dark-700 bg-dark-700/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <UserCheck className="w-5 h-5 text-blue-400" />
                  <span className="text-sm text-gray-400">Текущий менеджер:</span>
                  <span className="text-white font-medium">
                    {getManagerById(currentManager)?.name || 'Неизвестно'}
                  </span>
                </div>
                <button
                  onClick={handleUnassign}
                  className="text-red-400 hover:text-red-300 text-sm transition-colors"
                >
                  Снять назначение
                </button>
              </div>
            </div>
          )}

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
              disabled={selectedManager === currentManager}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <UserCheck className="w-4 h-4" />
              <span>Назначить</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
