'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, User, Mail, Phone, MessageSquare, FileText, DollarSign, UserCheck, TrendingUp, AlertCircle } from 'lucide-react'

interface Lead {
  id: string
  name: string
  email: string
  phone: string
  telegram: string
  createdAt: string
  source: string
  status: 'new' | 'contacted' | 'thinking' | 'investor' | 'converted' | 'lost'
  message?: string
  notes?: string
  assignedTo?: string
  priority: 'low' | 'medium' | 'high'
  language: string
  updatedAt: string
  depositAmount?: number
}

interface EditLeadModalProps {
  isOpen: boolean
  onClose: () => void
  lead: Lead | null
  onSave: (updatedLead: Lead) => void
}

export default function EditLeadModal({ isOpen, onClose, lead, onSave }: EditLeadModalProps) {
  const [formData, setFormData] = useState<Partial<Lead>>({})
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (lead) {
      setFormData(lead)
      setErrors({})
    }
  }, [lead])

  const handleInputChange = (field: string, value: string | number | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Очищаем ошибку при изменении поля
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name?.trim()) {
      newErrors.name = 'Имя обязательно'
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'Email обязателен'
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Неверный формат email'
      }
    }

    if (!formData.phone?.trim()) {
      newErrors.phone = 'Телефон обязателен'
    }

    if (formData.depositAmount !== undefined && formData.depositAmount < 0) {
      newErrors.depositAmount = 'Сумма депозита не может быть отрицательной'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      if (lead) {
        const updatedLead = { ...lead, ...formData, updatedAt: new Date().toISOString() }
        await onSave(updatedLead)
        onClose()
      }
    } catch (error) {
      console.error('Error saving lead:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-dark-800 rounded-xl border border-dark-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Заголовок */}
          <div className="flex items-center justify-between p-6 border-b border-dark-700">
            <div>
              <h2 className="text-2xl font-bold text-white">Редактировать заявку</h2>
              <p className="text-gray-400 mt-1">Обновите информацию о клиенте</p>
            </div>
            <button
              onClick={handleClose}
              disabled={loading}
              className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Форма */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Основная информация */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-dark-700 pb-2">
                  Основная информация
                </h3>
                
                {/* Имя */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Имя *
                  </label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-4 py-2 bg-dark-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.name ? 'border-red-500' : 'border-dark-600'
                    }`}
                    placeholder="Введите имя клиента"
                  />
                  {errors.name && (
                    <p className="text-red-400 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-4 py-2 bg-dark-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.email ? 'border-red-500' : 'border-dark-600'
                    }`}
                    placeholder="email@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Телефон */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Телефон *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full px-4 py-2 bg-dark-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.phone ? 'border-red-500' : 'border-dark-600'
                    }`}
                    placeholder="+7 (999) 123-45-67"
                  />
                  {errors.phone && (
                    <p className="text-red-400 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Telegram */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <MessageSquare className="w-4 h-4 inline mr-2" />
                    Telegram
                  </label>
                  <input
                    type="text"
                    value={formData.telegram || ''}
                    onChange={(e) => handleInputChange('telegram', e.target.value)}
                    className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="@username"
                  />
                </div>
              </div>

              {/* Дополнительная информация */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-dark-700 pb-2">
                  Дополнительная информация
                </h3>

                {/* Статус */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <TrendingUp className="w-4 h-4 inline mr-2" />
                    Статус
                  </label>
                  <select
                    value={formData.status || 'new'}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="new">Новая</option>
                    <option value="contacted">Связались</option>
                    <option value="thinking">Размышляет</option>
                    <option value="investor">Инвестор</option>
                    <option value="converted">Конвертированная</option>
                    <option value="lost">Потерянная</option>
                  </select>
                </div>

                {/* Приоритет */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <AlertCircle className="w-4 h-4 inline mr-2" />
                    Приоритет
                  </label>
                  <select
                    value={formData.priority || 'medium'}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                    className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">Низкий</option>
                    <option value="medium">Средний</option>
                    <option value="high">Высокий</option>
                  </select>
                </div>

                {/* Назначен менеджеру */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <UserCheck className="w-4 h-4 inline mr-2" />
                    Назначен менеджеру
                  </label>
                  <input
                    type="text"
                    value={formData.assignedTo || ''}
                    onChange={(e) => handleInputChange('assignedTo', e.target.value)}
                    className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Имя менеджера"
                  />
                </div>

                {/* Сумма депозита */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <DollarSign className="w-4 h-4 inline mr-2" />
                    Сумма депозита ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={formData.depositAmount || ''}
                    onChange={(e) => handleInputChange('depositAmount', e.target.value ? Number(e.target.value) : undefined)}
                    className={`w-full px-4 py-2 bg-dark-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.depositAmount ? 'border-red-500' : 'border-dark-600'
                    }`}
                    placeholder="0"
                  />
                  {errors.depositAmount && (
                    <p className="text-red-400 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.depositAmount}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Сообщение и заметки */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-dark-700 pb-2">
                Сообщение и заметки
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Сообщение клиента */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <MessageSquare className="w-4 h-4 inline mr-2" />
                    Сообщение клиента
                  </label>
                  <textarea
                    value={formData.message || ''}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Сообщение от клиента..."
                  />
                </div>

                {/* Заметки менеджера */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <FileText className="w-4 h-4 inline mr-2" />
                    Заметки менеджера
                  </label>
                  <textarea
                    value={formData.notes || ''}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Внутренние заметки..."
                  />
                </div>
              </div>
            </div>

            {/* Системная информация */}
            <div className="bg-dark-700 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-300 mb-3">Системная информация</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">ID:</span>
                  <span className="text-white ml-2">{formData.id}</span>
                </div>
                <div>
                  <span className="text-gray-400">Создано:</span>
                  <span className="text-white ml-2">
                    {formData.createdAt ? new Date(formData.createdAt).toLocaleString('ru-RU') : '-'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Обновлено:</span>
                  <span className="text-white ml-2">
                    {formData.updatedAt ? new Date(formData.updatedAt).toLocaleString('ru-RU') : '-'}
                  </span>
                </div>
              </div>
            </div>

            {/* Кнопки */}
            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-dark-700">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="px-6 py-2 text-gray-300 hover:text-white transition-colors disabled:opacity-50"
              >
                Отмена
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{loading ? 'Сохранение...' : 'Сохранить'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
