'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Phone, MessageSquare, Calendar, UserCheck, DollarSign, FileText as _FileText, TrendingUp, Clock, AlertCircle } from 'lucide-react'

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

interface LeadDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  lead: Lead | null
}

const getStatusInfo = (status: string) => {
  switch (status) {
    case 'new':
      return { label: 'Новая', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: Clock }
    case 'contacted':
      return { label: 'Связались', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: MessageSquare }
    case 'thinking':
      return { label: 'Размышляет', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', icon: Clock }
    case 'investor':
      return { label: 'Инвестор', color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30', icon: UserCheck }
    case 'converted':
      return { label: 'Конвертированная', color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: TrendingUp }
    case 'lost':
      return { label: 'Потерянная', color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: X }
    default:
      return { label: 'Неизвестно', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', icon: Clock }
  }
}

const getPriorityInfo = (priority: string) => {
  switch (priority) {
    case 'low':
      return { label: 'Низкий', color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: AlertCircle }
    case 'medium':
      return { label: 'Средний', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: AlertCircle }
    case 'high':
      return { label: 'Высокий', color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: AlertCircle }
    default:
      return { label: 'Неизвестно', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', icon: AlertCircle }
  }
}

export default function LeadDetailsModal({ isOpen, onClose, lead }: LeadDetailsModalProps) {
  if (!lead) return null

  const statusInfo = getStatusInfo(lead.status)
  const priorityInfo = getPriorityInfo(lead.priority)
  const StatusIcon = statusInfo.icon
  const PriorityIcon = priorityInfo.icon

  return (
    <AnimatePresence>
      {isOpen && (
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
            className="bg-dark-800 rounded-xl border border-dark-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Заголовок */}
            <div className="flex items-center justify-between p-6 border-b border-dark-700">
              <div>
                <h2 className="text-2xl font-bold text-white">{lead.name}</h2>
                <p className="text-gray-400 mt-1">ID: {lead.id}</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Основная информация */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Контактная информация */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white border-b border-dark-600 pb-2">Контактная информация</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-blue-400" />
                      <div>
                        <div className="text-white font-medium">{lead.email}</div>
                        <div className="text-sm text-gray-400">Email</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-green-400" />
                      <div>
                        <div className="text-white font-medium">{lead.phone}</div>
                        <div className="text-sm text-gray-400">Телефон</div>
                      </div>
                    </div>
                    
                    {lead.telegram && (
                      <div className="flex items-center space-x-3">
                        <MessageSquare className="w-5 h-5 text-indigo-400" />
                        <div>
                          <div className="text-white font-medium">{lead.telegram}</div>
                          <div className="text-sm text-gray-400">Telegram</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Статус и приоритет */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white border-b border-dark-600 pb-2">Статус и приоритет</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <StatusIcon className="w-5 h-5 text-blue-400" />
                      <div>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                        <div className="text-sm text-gray-400 mt-1">Статус заявки</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <PriorityIcon className="w-5 h-5 text-orange-400" />
                      <div>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${priorityInfo.color}`}>
                          {priorityInfo.label}
                        </span>
                        <div className="text-sm text-gray-400 mt-1">Приоритет</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Дополнительная информация */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Менеджер */}
                <div className="space-y-3">
                  <h4 className="text-md font-semibold text-white">Менеджер</h4>
                  {lead.assignedTo ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-sm text-white font-medium">
                        {lead.assignedTo.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-gray-300">{lead.assignedTo}</span>
                    </div>
                  ) : (
                    <span className="text-gray-500">Не назначен</span>
                  )}
                </div>

                {/* Сумма депозита */}
                <div className="space-y-3">
                  <h4 className="text-md font-semibold text-white">Сумма депозита</h4>
                  {lead.depositAmount ? (
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-5 h-5 text-green-400" />
                      <span className="text-green-400 font-bold text-lg">
                        ${lead.depositAmount.toLocaleString()}
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-500">Не указана</span>
                  )}
                </div>

                {/* Язык */}
                <div className="space-y-3">
                  <h4 className="text-md font-semibold text-white">Язык</h4>
                  <span className="text-gray-300">{lead.language}</span>
                </div>
              </div>

              {/* Даты */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-md font-semibold text-white">Дата создания</h4>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">
                      {new Date(lead.createdAt).toLocaleDateString('ru-RU')} в {new Date(lead.createdAt).toLocaleTimeString('ru-RU')}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="text-md font-semibold text-white">Последнее обновление</h4>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">
                      {new Date(lead.updatedAt).toLocaleDateString('ru-RU')} в {new Date(lead.updatedAt).toLocaleTimeString('ru-RU')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Источник */}
              <div className="space-y-3">
                <h4 className="text-md font-semibold text-white">Источник заявки</h4>
                <span className="text-gray-300">{lead.source}</span>
              </div>

              {/* Сообщение клиента */}
              {lead.message && (
                <div className="space-y-3">
                  <h4 className="text-md font-semibold text-white">Сообщение клиента</h4>
                  <div className="p-4 bg-dark-700 rounded-lg border border-dark-600">
                    <p className="text-gray-300">{lead.message}</p>
                  </div>
                </div>
              )}

              {/* Заметки менеджера */}
              {lead.notes && (
                <div className="space-y-3">
                  <h4 className="text-md font-semibold text-white">Заметки менеджера</h4>
                  <div className="p-4 bg-dark-700 rounded-lg border border-dark-600">
                    <p className="text-gray-300 whitespace-pre-wrap">{lead.notes}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Кнопки */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-dark-700">
              <button
                onClick={onClose}
                className="px-6 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Закрыть
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
