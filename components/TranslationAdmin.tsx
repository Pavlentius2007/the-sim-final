'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Save, X, RefreshCw, Settings, Globe, FileText } from 'lucide-react'
import { useTranslations } from '@/hooks/useTranslations'
import { getLanguageOptions, getLanguageConfig as _getLanguageConfig } from '@/utils/languageUtils'


interface TranslationEntry {
  key: string
  russianText: string
  translations: Record<string, string>
  isEditing: boolean
}

export default function TranslationAdmin() {
  const { t: _t } = useTranslations()
  
  // Функции для работы с переводами
  const addTranslation = async (key: string, text: string) => {
    try {
      const response = await fetch('/api/translations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'add',
          key,
          text
        })
      })

      const data = await response.json()
      if (data.success) {
        setMessage('Перевод добавлен успешно')
        setMessageType('success')
        setNewKey('')
        setNewText('')
        setIsAdding(false)
      } else {
        setMessage('Ошибка при добавлении перевода')
        setMessageType('error')
      }
    } catch {
      setMessage('Ошибка при добавлении перевода')
      setMessageType('error')
    }
  }

  const updateTranslation = async (key: string, text: string) => {
    try {
      const response = await fetch('/api/translations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'update',
          key,
          text
        })
      })

      const data = await response.json()
      if (data.success) {
        setMessage('Перевод обновлен успешно')
        setMessageType('success')
        // Обновляем локальное состояние
        setTranslations(prev => prev.map(t => 
          t.key === key ? { ...t, russianText: text, isEditing: false } : t
        ))
      } else {
        setMessage('Ошибка при обновлении перевода')
        setMessageType('error')
      }
    } catch {
      setMessage('Ошибка при обновлении перевода')
      setMessageType('error')
    }
  }

  const _getTranslationStats = async () => {
    try {
      const response = await fetch('/api/translations')
      const data = await response.json()
      
      if (data.success) {
        setStats(data.data)
      } else {
        setMessage('Ошибка при получении статистики')
        setMessageType('error')
      }
    } catch {
      setMessage('Ошибка при получении статистики')
      setMessageType('error')
    }
  }
  const [translations, setTranslations] = useState<TranslationEntry[]>([])
  const [newKey, setNewKey] = useState('')
  const [newText, setNewText] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [stats, setStats] = useState({ totalKeys: 0, cachedKeys: 0, languages: [] })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info')

  const languageOptions = getLanguageOptions()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      loadStats()
    }
  }, [])

  const loadStats = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/translations')
      const data = await response.json()
      
      if (data.success) {
        setStats(data.data)
      } else {
        setMessage('Ошибка загрузки статистики')
        setMessageType('error')
      }
    } catch {
      setMessage('Ошибка загрузки статистики')
      setMessageType('error')
    }
    setIsLoading(false)
  }

  const showMessage = (text: string, type: 'success' | 'error' | 'info') => {
    setMessage(text)
    setMessageType(type)
    setTimeout(() => setMessage(''), 3000)
  }

  const handleAddTranslation = async () => {
    if (!newKey.trim() || !newText.trim()) {
      showMessage('Заполните все поля', 'error')
      return
    }

    setIsAdding(true)
    try {
      await addTranslation(newKey.trim(), newText.trim())
      
      // Добавляем в локальное состояние
      const newEntry: TranslationEntry = {
        key: newKey.trim(),
        russianText: newText.trim(),
        translations: {},
        isEditing: false
      }
      
      setTranslations(prev => [...prev, newEntry])
      setNewKey('')
      setNewText('')
      setIsAdding(false)
      loadStats()
      showMessage('Перевод добавлен успешно', 'success')
    } catch {
      setIsAdding(false)
      showMessage('Ошибка добавления перевода', 'error')
    }
  }

  const handleUpdateTranslation = async (key: string, text: string) => {
    try {
      await updateTranslation(key, text)
      
      setTranslations(prev => prev.map(t => 
        t.key === key 
          ? { ...t, russianText: text, isEditing: false }
          : t
      ))
      
      showMessage('Перевод обновлен успешно', 'success')
    } catch {
      showMessage('Ошибка обновления перевода', 'error')
    }
  }

  const toggleEdit = (key: string) => {
    setTranslations(prev => prev.map(t => 
      t.key === key ? { ...t, isEditing: !t.isEditing } : t
    ))
  }

  const clearCache = () => {
    // В реальном проекте здесь будет вызов API для очистки кэша
    showMessage('Кэш очищен', 'info')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Globe className="w-8 h-8" />
            Панель управления переводами
          </h1>
          <p className="text-gray-300">Управляйте переводами для всех языков сайта</p>
        </motion.div>

        {/* Статистика */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-blue-400" />
              <div>
                <p className="text-gray-300 text-sm">Всего ключей</p>
                <p className="text-2xl font-bold text-white">{stats.totalKeys}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3">
              <Settings className="w-6 h-6 text-green-400" />
              <div>
                <p className="text-gray-300 text-sm">В кэше</p>
                <p className="text-2xl font-bold text-white">{stats.cachedKeys}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3">
              <Globe className="w-6 h-6 text-purple-400" />
              <div>
                <p className="text-gray-300 text-sm">Языки</p>
                <p className="text-2xl font-bold text-white">{stats.languages.length}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Сообщения */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-lg ${
              messageType === 'success' ? 'bg-green-500/20 border border-green-500/50 text-green-300' :
              messageType === 'error' ? 'bg-red-500/20 border border-red-500/50 text-red-300' :
              'bg-blue-500/20 border border-blue-500/50 text-blue-300'
            }`}
          >
            {message}
          </motion.div>
        )}

        {/* Кнопки управления */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-4 mb-8"
        >
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Добавить перевод
          </button>
          
          <button
            onClick={loadStats}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Загрузка...' : 'Обновить статистику'}
          </button>
          
          <button
            onClick={clearCache}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4" />
            Очистить кэш
          </button>
        </motion.div>

        {/* Форма добавления */}
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Добавить новый перевод</h3>
              <button
                onClick={() => setIsAdding(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2">Ключ перевода</label>
                <input
                  type="text"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  placeholder="например: hero.title"
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 text-sm mb-2">Русский текст</label>
                <input
                  type="text"
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="Введите текст на русском"
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleAddTranslation}
                disabled={!newKey.trim() || !newText.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                Сохранить
              </button>
              
              <button
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Отмена
              </button>
            </div>
          </motion.div>
        )}

        {/* Список переводов */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden"
        >
          <div className="p-6 border-b border-white/20">
            <h3 className="text-xl font-semibold text-white">Существующие переводы</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-3 text-left text-gray-300 font-medium">Ключ</th>
                  <th className="px-6 py-3 text-left text-gray-300 font-medium">Русский</th>
                  {languageOptions.filter(lang => lang.value !== 'ru').map(lang => (
                    <th key={lang.value} className="px-6 py-3 text-left text-gray-300 font-medium">
                      <div className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.label}</span>
                      </div>
                    </th>
                  ))}
                  <th className="px-6 py-3 text-left text-gray-300 font-medium">Действия</th>
                </tr>
              </thead>
              
              <tbody>
                {translations.length === 0 ? (
                  <tr>
                    <td colSpan={languageOptions.length + 2} className="px-6 py-8 text-center text-gray-400">
                      Нет переводов. Добавьте первый перевод выше.
                    </td>
                  </tr>
                ) : (
                  translations.map((translation, _index) => (
                    <tr key={translation.key} className="border-t border-white/10">
                      <td className="px-6 py-4 text-white font-mono text-sm">
                        {translation.key}
                      </td>
                      
                      <td className="px-6 py-4">
                        {translation.isEditing ? (
                          <input
                            type="text"
                            defaultValue={translation.russianText}
                            onBlur={(e) => handleUpdateTranslation(translation.key, e.target.value)}
                            className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm"
                          />
                        ) : (
                          <span className="text-white">{translation.russianText}</span>
                        )}
                      </td>
                      
                      {languageOptions.filter(lang => lang.value !== 'ru').map(lang => (
                        <td key={lang.value} className="px-6 py-4">
                          <span className="text-gray-400 text-sm">
                            {translation.translations[lang.value] || 'Автоперевод'}
                          </span>
                        </td>
                      ))}
                      
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleEdit(translation.key)}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 