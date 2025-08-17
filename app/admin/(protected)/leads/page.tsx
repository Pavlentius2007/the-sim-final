'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  Search, 
  Download, 
  Mail, 
  Phone,
  Eye,
  Trash2,
  RefreshCw,
  Edit,
  MessageSquare,
  DollarSign,
  UserCheck,
  TrendingUp,
  AlertCircle,
  FileText
} from 'lucide-react'
import EditLeadModal from '@/components/EditLeadModal'
import QuickStatusEdit from '@/components/QuickStatusEdit'
import QuickPriorityEdit from '@/components/QuickPriorityEdit'
import QuickManagerAssign from '@/components/QuickManagerAssign'
import QuickNotesEdit from '@/components/QuickNotesEdit'
import QuickDepositEdit from '@/components/QuickDepositEdit'
import LeadDetailsModal from '@/components/LeadDetailsModal'

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

export default function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [managerFilter, setManagerFilter] = useState<string>('all')
  const [editingLead, setEditingLead] = useState<Lead | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [quickStatusEdit, setQuickStatusEdit] = useState<{ leadId: string; currentStatus: string } | null>(null)
  const [quickPriorityEdit, setQuickPriorityEdit] = useState<{ leadId: string; currentPriority: string } | null>(null)
  const [quickManagerAssign, setQuickManagerAssign] = useState<{ leadId: string; currentManager: string } | null>(null)
  const [quickNotesEdit, setQuickNotesEdit] = useState<{ leadId: string; currentNotes: string; leadName: string } | null>(null)
  const [quickDepositEdit, setQuickDepositEdit] = useState<{ leadId: string; currentAmount: number | undefined; leadName: string } | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)

  useEffect(() => {
    loadLeads()
  }, [searchTerm, statusFilter, priorityFilter, managerFilter])

  const loadLeads = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (priorityFilter !== 'all') params.append('priority', priorityFilter)
      if (managerFilter !== 'all') params.append('assignedTo', managerFilter)
      
      const response = await fetch(`/api/leads?${params}`)
      const result = await response.json()
      
      if (result.success) {
        setLeads(result.data)
      } else {
        console.error('Failed to load leads:', result.error)
      }
    } catch (error) {
      console.error('Error loading leads:', error)
    } finally {
      setLoading(false)
    }
  }

  const _handleStatusChange = async (leadId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus, updatedAt: new Date().toISOString() }),
      })

      if (response.ok) {
        // Обновляем локальное состояние
        setLeads(prev => prev.map(lead => 
          lead.id === leadId 
            ? { ...lead, status: newStatus as any, updatedAt: new Date().toISOString() }
            : lead
        ))
      } else {
        console.error('Failed to update status')
      }
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const handleDelete = async (leadId: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту заявку?')) {
      return
    }

    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setLeads(prev => prev.filter(lead => lead.id !== leadId))
      } else {
        console.error('Failed to delete lead')
      }
    } catch (error) {
      console.error('Error deleting lead:', error)
    }
  }

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead)
    setShowEditModal(true)
  }

  const handleSaveLead = async (updatedLead: Lead) => {
    try {
      const response = await fetch(`/api/leads/${updatedLead.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedLead),
      })

      if (response.ok) {
        setLeads(prev => prev.map(lead => 
          lead.id === updatedLead.id ? updatedLead : lead
        ))
        setShowEditModal(false)
        setEditingLead(null)
      } else {
        console.error('Failed to update lead')
      }
    } catch (error) {
      console.error('Error updating lead:', error)
    }
  }

  const handleQuickStatusEdit = (leadId: string, currentStatus: string) => {
    setQuickStatusEdit({ leadId, currentStatus })
  }

  const handleQuickStatusChange = async (newStatus: string) => {
    if (!quickStatusEdit) return
    
    try {
      const response = await fetch(`/api/leads/${quickStatusEdit.leadId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus, updatedAt: new Date().toISOString() }),
      })

      if (response.ok) {
        setLeads(prev => prev.map(lead => 
          lead.id === quickStatusEdit.leadId 
            ? { ...lead, status: newStatus as any, updatedAt: new Date().toISOString() }
            : lead
        ))
      } else {
        console.error('Failed to update status')
      }
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const handleQuickPriorityEdit = (leadId: string, currentPriority: string) => {
    setQuickPriorityEdit({ leadId, currentPriority })
  }

  const handleQuickPriorityChange = async (newPriority: string) => {
    if (!quickPriorityEdit) return
    
    try {
      const response = await fetch(`/api/leads/${quickPriorityEdit.leadId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priority: newPriority, updatedAt: new Date().toISOString() }),
      })

      if (response.ok) {
        setLeads(prev => prev.map(lead => 
          lead.id === quickPriorityEdit.leadId 
            ? { ...lead, priority: newPriority as any, updatedAt: new Date().toISOString() }
            : lead
        ))
      } else {
        console.error('Failed to update priority')
      }
    } catch (error) {
      console.error('Error updating priority:', error)
    }
  }

  const handleQuickManagerAssign = (leadId: string, currentManager: string) => {
    setQuickManagerAssign({ leadId, currentManager })
  }

  const handleQuickManagerChange = async (newManager: string) => {
    if (!quickManagerAssign) return
    
    try {
      const response = await fetch(`/api/leads/${quickManagerAssign.leadId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ assignedTo: newManager, updatedAt: new Date().toISOString() }),
      })

      if (response.ok) {
        setLeads(prev => prev.map(lead => 
          lead.id === quickManagerAssign.leadId 
            ? { ...lead, assignedTo: newManager, updatedAt: new Date().toISOString() }
            : lead
        ))
      } else {
        console.error('Failed to update manager')
      }
    } catch (error) {
      console.error('Error updating manager:', error)
    }
  }

  const handleQuickNotesEdit = (leadId: string, currentNotes: string, leadName: string) => {
    setQuickNotesEdit({ leadId, currentNotes, leadName })
  }

  const handleQuickNotesChange = async (newNotes: string) => {
    if (!quickNotesEdit) return
    
    try {
      const response = await fetch(`/api/leads/${quickNotesEdit.leadId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes: newNotes, updatedAt: new Date().toISOString() }),
      })

      if (response.ok) {
        setLeads(prev => prev.map(lead => 
          lead.id === quickNotesEdit.leadId 
            ? { ...lead, notes: newNotes, updatedAt: new Date().toISOString() }
            : lead
        ))
      } else {
        console.error('Failed to update notes')
      }
    } catch (error) {
      console.error('Error updating notes:', error)
    }
  }

  const handleQuickDepositEdit = (leadId: string, currentAmount: number | undefined, leadName: string) => {
    setQuickDepositEdit({ leadId, currentAmount, leadName })
  }

  const handleQuickDepositChange = async (newAmount: number | undefined) => {
    if (!quickDepositEdit) return
    
    try {
      const response = await fetch(`/api/leads/${quickDepositEdit.leadId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ depositAmount: newAmount, updatedAt: new Date().toISOString() }),
      })

      if (response.ok) {
        setLeads(prev => prev.map(lead => 
          lead.id === quickDepositEdit.leadId 
            ? { ...lead, depositAmount: newAmount, updatedAt: new Date().toISOString() }
            : lead
        ))
      } else {
        console.error('Failed to update deposit amount')
      }
    } catch (error) {
      console.error('Error updating deposit amount:', error)
    }
  }

  const handleViewDetails = (lead: Lead) => {
    setSelectedLead(lead)
    setShowDetailsModal(true)
  }

  const exportLeads = async () => {
    try {
      const response = await fetch('/api/leads/export')
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Error exporting leads:', error)
    }
  }

  const _getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'contacted':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'thinking':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      case 'investor':
        return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
      case 'converted':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'lost':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const _getStatusText = (status: string) => {
    switch (status) {
      case 'new':
        return 'Новая'
      case 'contacted':
        return 'Связались'
      case 'thinking':
        return 'Размышляет'
      case 'investor':
        return 'Инвестор'
      case 'converted':
        return 'Конвертирована'
      case 'lost':
        return 'Потеряна'
      default:
        return status
    }
  }

  const _getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'low':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const _getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Высокий'
      case 'medium':
        return 'Средний'
      case 'low':
        return 'Низкий'
      default:
        return priority
    }
  }

  // Фильтрация заявок
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm) ||
      (lead.telegram && lead.telegram.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || lead.priority === priorityFilter
    
    let matchesManager = true
    if (managerFilter === 'assigned') {
      matchesManager = !!lead.assignedTo
    } else if (managerFilter === 'unassigned') {
      matchesManager = !lead.assignedTo
    } else if (managerFilter !== 'all') {
      matchesManager = lead.assignedTo === managerFilter
    }
    
    return matchesSearch && matchesStatus && matchesPriority && matchesManager
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Загрузка заявок...</p>
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
          <h1 className="text-3xl font-bold text-white">Заявки</h1>
          <p className="text-gray-400 mt-1">Управление заявками клиентов</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={exportLeads}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Экспорт</span>
          </button>
          <button
            onClick={loadLeads}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Обновить</span>
          </button>
        </div>
      </motion.div>

      {/* Фильтры и поиск */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-dark-800 rounded-xl p-6 border border-dark-700"
      >
        {/* Фильтры */}
        <div className="flex flex-wrap items-center gap-4 p-4 bg-dark-700/30 rounded-lg border border-dark-600">
          {/* Поиск */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск по имени, email, телефону..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
            />
          </div>

          {/* Фильтр по статусу */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Все статусы</option>
            <option value="new">Новые</option>
            <option value="contacted">Связались</option>
            <option value="thinking">Размышляют</option>
            <option value="investor">Инвесторы</option>
            <option value="converted">Конвертированные</option>
            <option value="lost">Потерянные</option>
          </select>

          {/* Фильтр по приоритету */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Все приоритеты</option>
            <option value="low">Низкий</option>
            <option value="medium">Средний</option>
            <option value="high">Высокий</option>
          </select>

          {/* Фильтр по менеджеру */}
          <select
            value={managerFilter}
            onChange={(e) => setManagerFilter(e.target.value)}
            className="px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Все менеджеры</option>
            <option value="assigned">Назначенные</option>
            <option value="unassigned">Не назначенные</option>
            <option value="manager1">Анна Петрова</option>
            <option value="manager2">Михаил Сидоров</option>
            <option value="manager3">Елена Козлова</option>
            <option value="manager4">Дмитрий Волков</option>
            <option value="manager5">Ольга Морозова</option>
          </select>

          {/* Сброс фильтров */}
          <button
            onClick={() => {
              setSearchTerm('')
              setStatusFilter('all')
              setPriorityFilter('all')
              setManagerFilter('all')
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-dark-600 hover:bg-dark-500 text-gray-300 hover:text-white rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Сбросить</span>
          </button>
        </div>

        {/* Статистика */}
        <div className="flex items-center justify-center">
          <span className="text-gray-400">
            Показано: <span className="text-white font-semibold">{filteredLeads.length}</span> из <span className="text-white font-semibold">{leads.length}</span>
          </span>
        </div>
      </motion.div>

      {/* Таблица заявок */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-700">
                <th className="text-left p-4 text-gray-300 font-medium">Клиент</th>
                <th className="text-left p-4 text-gray-300 font-medium">Контакты</th>
                <th className="text-left p-4 text-gray-300 font-medium">Статус</th>
                <th className="text-left p-4 text-gray-300 font-medium">Приоритет</th>
                <th className="text-left p-4 text-gray-300 font-medium">Менеджер</th>
                <th className="text-left p-4 text-gray-300 font-medium">Сумма</th>
                <th className="text-left p-4 text-gray-300 font-medium">Источник</th>
                <th className="text-left p-4 text-gray-300 font-medium">Дата</th>
                <th className="text-left p-4 text-gray-300 font-medium">Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="border-b border-dark-700 hover:bg-dark-700/30 transition-colors">
                  {/* Клиент */}
                  <td className="p-4">
                    <div>
                      <div className="font-medium text-white">{lead.name}</div>
                      <div className="text-sm text-gray-400">{lead.language}</div>
                    </div>
                  </td>

                  {/* Контакты */}
                  <td className="p-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-sm">
                        <Mail className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-300">{lead.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-300">{lead.phone}</span>
                      </div>
                      {lead.telegram && (
                        <div className="flex items-center space-x-2 text-sm">
                          <MessageSquare className="w-3 h-3 text-gray-400" />
                          <span className="text-gray-300">{lead.telegram}</span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Статус */}
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      lead.status === 'new' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                      lead.status === 'contacted' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                      lead.status === 'thinking' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                      lead.status === 'investor' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' :
                      lead.status === 'converted' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                      'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {lead.status === 'new' ? 'Новая' :
                       lead.status === 'contacted' ? 'Связались' :
                       lead.status === 'thinking' ? 'Размышляет' :
                       lead.status === 'investor' ? 'Инвестор' :
                       lead.status === 'converted' ? 'Конвертированная' : 'Потерянная'}
                    </span>
                  </td>

                  {/* Приоритет */}
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      lead.priority === 'low' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                      lead.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                      'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {lead.priority === 'low' ? 'Низкий' :
                       lead.priority === 'medium' ? 'Средний' : 'Высокий'}
                    </span>
                  </td>

                  {/* Менеджер */}
                  <td className="p-4">
                    {lead.assignedTo ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-xs text-white font-medium">
                          {lead.assignedTo.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-gray-300 text-sm">{lead.assignedTo}</span>
                      </div>
                    ) : (
                      <span className="text-gray-500 text-sm">Не назначен</span>
                    )}
                  </td>

                  {/* Сумма депозита */}
                  <td className="p-4">
                    {lead.depositAmount ? (
                      <div className="text-green-400 font-medium">
                        ${lead.depositAmount.toLocaleString()}
                      </div>
                    ) : (
                      <span className="text-gray-500 text-sm">Не указана</span>
                    )}
                  </td>

                  {/* Источник */}
                  <td className="p-4">
                    <span className="text-gray-300 text-sm">{lead.source}</span>
                  </td>

                  {/* Дата */}
                  <td className="p-4">
                    <div className="text-sm">
                      <div className="text-gray-300">
                        {new Date(lead.createdAt).toLocaleDateString('ru-RU')}
                      </div>
                      <div className="text-gray-500">
                        {new Date(lead.createdAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </td>

                  {/* Действия */}
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewDetails(lead)}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                        title="Просмотреть детали"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => handleEdit(lead)}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                        title="Редактировать"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => handleQuickStatusEdit(lead.id, lead.status)}
                        className="text-yellow-400 hover:text-yellow-300 transition-colors"
                        title="Изменить статус"
                      >
                        <TrendingUp className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => handleQuickPriorityEdit(lead.id, lead.priority)}
                        className="text-orange-400 hover:text-orange-300 transition-colors"
                        title="Изменить приоритет"
                      >
                        <AlertCircle className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => handleQuickManagerAssign(lead.id, lead.assignedTo || '')}
                        className="text-indigo-400 hover:text-indigo-300 transition-colors"
                        title="Назначить менеджера"
                      >
                        <UserCheck className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => handleQuickNotesEdit(lead.id, lead.notes || '', lead.name)}
                        className="text-purple-400 hover:text-purple-300 transition-colors"
                        title="Редактировать заметки"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => handleQuickDepositEdit(lead.id, lead.depositAmount, lead.name)}
                        className="text-green-400 hover:text-green-300 transition-colors"
                        title="Изменить сумму депозита"
                      >
                        <DollarSign className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => handleDelete(lead.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                        title="Удалить"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLeads.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">Заявки не найдены</p>
          </div>
        )}
      </motion.div>

      {/* Модальное окно редактирования */}
      <EditLeadModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setEditingLead(null)
        }}
        lead={editingLead}
        onSave={handleSaveLead}
      />

      {/* Быстрое редактирование статуса */}
      {quickStatusEdit && (
        <QuickStatusEdit
          currentStatus={quickStatusEdit.currentStatus}
          onStatusChange={handleQuickStatusChange}
          onClose={() => setQuickStatusEdit(null)}
        />
      )}

      {/* Быстрое редактирование приоритета */}
      {quickPriorityEdit && (
        <QuickPriorityEdit
          currentPriority={quickPriorityEdit.currentPriority}
          onPriorityChange={handleQuickPriorityChange}
          onClose={() => setQuickPriorityEdit(null)}
        />
      )}

      {/* Быстрое назначение менеджера */}
      {quickManagerAssign && (
        <QuickManagerAssign
          currentManager={quickManagerAssign.currentManager}
          onManagerChange={handleQuickManagerChange}
          onClose={() => setQuickManagerAssign(null)}
        />
      )}

      {/* Быстрое редактирование заметок */}
      {quickNotesEdit && (
        <QuickNotesEdit
          currentNotes={quickNotesEdit.currentNotes}
          onNotesChange={handleQuickNotesChange}
          onClose={() => setQuickNotesEdit(null)}
          leadName={quickNotesEdit.leadName}
        />
      )}

      {/* Быстрое редактирование суммы депозита */}
      {quickDepositEdit && (
        <QuickDepositEdit
          currentAmount={quickDepositEdit.currentAmount}
          onAmountChange={handleQuickDepositChange}
          onClose={() => setQuickDepositEdit(null)}
          leadName={quickDepositEdit.leadName}
        />
      )}

      {/* Модальное окно деталей заявки */}
      <LeadDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        lead={selectedLead}
      />
    </div>
  )
}
