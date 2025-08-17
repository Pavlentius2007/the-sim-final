'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, DollarSign, TrendingUp, TrendingDown as _TrendingDown, Minus as _Minus } from 'lucide-react'

interface QuickDepositEditProps {
  currentAmount: number | undefined
  onAmountChange: (newAmount: number | undefined) => void
  onClose: () => void
  leadName: string
}

const quickAmounts = [
  { value: 1000, label: '$1,000', description: 'Минимальная сумма' },
  { value: 5000, label: '$5,000', description: 'Стандартная сумма' },
  { value: 10000, label: '$10,000', description: 'Средняя сумма' },
  { value: 25000, label: '$25,000', description: 'Высокая сумма' },
  { value: 50000, label: '$50,000', description: 'Премиум сумма' },
  { value: 100000, label: '$100,000', description: 'VIP сумма' }
]

export default function QuickDepositEdit({ currentAmount, onAmountChange, onClose, leadName }: QuickDepositEditProps) {
  const [amount, setAmount] = useState(currentAmount?.toString() || '')
  const [customAmount, setCustomAmount] = useState('')

  const handleSave = () => {
    const newAmount = amount ? parseFloat(amount) : undefined
    if (newAmount !== currentAmount) {
      onAmountChange(newAmount)
    }
    onClose()
  }

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString())
  }

  const handleCustomAmount = () => {
    if (customAmount) {
      const parsed = parseFloat(customAmount)
      if (!isNaN(parsed) && parsed > 0) {
        setAmount(parsed.toString())
        setCustomAmount('')
      }
    }
  }

  const clearAmount = () => {
    setAmount('')
  }

  const formatAmount = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
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
            <div>
              <h3 className="text-lg font-semibold text-white">Сумма депозита</h3>
              <p className="text-sm text-gray-400">Клиент: {leadName}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Текущая сумма */}
          {currentAmount && (
            <div className="p-4 border-b border-dark-700 bg-dark-700/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  <span className="text-sm text-gray-300">Текущая сумма:</span>
                  <span className="text-white font-medium text-lg">
                    {formatAmount(currentAmount)}
                  </span>
                </div>
                <button
                  onClick={clearAmount}
                  className="text-red-400 hover:text-red-300 text-sm transition-colors"
                >
                  Убрать сумму
                </button>
              </div>
            </div>
          )}

          {/* Быстрые суммы */}
          <div className="p-4">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              <DollarSign className="w-4 h-4 inline mr-2" />
              Выберите сумму или введите свою
            </label>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              {quickAmounts.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleQuickAmount(option.value)}
                  className={`p-3 rounded-lg border transition-all text-left ${
                    amount === option.value.toString()
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-dark-600 hover:border-dark-500 hover:bg-dark-700/50'
                  }`}
                >
                  <div className="font-medium text-white">{option.label}</div>
                  <div className="text-xs text-gray-400">{option.description}</div>
                </button>
              ))}
            </div>

            {/* Пользовательская сумма */}
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="Введите сумму..."
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="flex-1 px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                step="100"
              />
              <button
                onClick={handleCustomAmount}
                disabled={!customAmount}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Добавить
              </button>
            </div>

            {/* Выбранная сумма */}
            {amount && (
              <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                    <span className="text-blue-300">Выбрано:</span>
                  </div>
                  <span className="text-blue-400 font-bold text-lg">
                    {formatAmount(parseFloat(amount))}
                  </span>
                </div>
              </div>
            )}
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
              disabled={amount === (currentAmount?.toString() || '')}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              <span>Сохранить</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
