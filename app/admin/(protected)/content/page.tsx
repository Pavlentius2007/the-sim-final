'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  FileText, 
  Globe, 
  Settings, 
  Save, 
  RefreshCw,
  Eye,
  ChevronDown,
  ChevronRight,
  Languages
} from 'lucide-react'
import ContentPreview from '@/components/ContentPreview'
import ContentNotifications from '@/components/ContentNotifications'

interface ContentSection {
  id: string
  name: string
  path: string
  description: string
  icon: any
}

const contentSections: ContentSection[] = [
  {
    id: 'hero',
    name: 'Главная секция (Hero)',
    path: 'hero',
    description: 'Заголовок, подзаголовок и призывы к действию',
    icon: Globe
  },
  {
    id: 'about',
    name: 'О платформе',
    path: 'about',
    description: 'Описание платформы и её возможностей',
    icon: FileText
  },
  {
    id: 'benefits',
    name: 'Преимущества',
    path: 'benefits',
    description: 'Ключевые преимущества платформы',
    icon: Settings
  },
  {
    id: 'video',
    name: 'Видеообзор',
    path: 'video',
    description: 'Информация о видео и его описании',
    icon: Eye
  },
  {
    id: 'security',
    name: 'Безопасность',
    path: 'security',
    description: 'Информация о безопасности платформы',
    icon: Settings
  },
  {
    id: 'testimonials',
    name: 'Отзывы',
    path: 'testimonials',
    description: 'Отзывы клиентов и истории успеха',
    icon: FileText
  },
  {
    id: 'contact',
    name: 'Контакты',
    path: 'contact',
    description: 'Контактная информация и форма обратной связи',
    icon: Globe
  }
]

const languages = [
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'th', name: 'ไทย', flag: '🇹🇭' }
]

export default function AdminContent() {
  const [selectedLanguage, setSelectedLanguage] = useState('ru')
  const [_selectedSection, _setSelectedSection] = useState<string | null>(null)
  const [_content, _setContent] = useState<any>(null)
  const [editingContent, setEditingContent] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
  const [showCopyModal, setShowCopyModal] = useState(false)
  const [copyFromLanguageState, setCopyFromLanguageState] = useState('ru')
  const [notifications, setNotifications] = useState<any[]>([])

  // Загрузка контента
  useEffect(() => {
    loadContent()
  }, [selectedLanguage])

  const loadContent = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/content?locale=${selectedLanguage}`)
      const result = await response.json()
      
      if (result.success) {
        _setContent(result.data)
        setEditingContent(result.data)
        addNotification('success', 'Контент успешно загружен')
      } else {
        console.error('Failed to load content:', result.error)
        addNotification('error', 'Ошибка при загрузке контента')
      }
    } catch (error) {
      console.error('Error loading content:', error)
      addNotification('error', 'Ошибка при загрузке контента')
    } finally {
      setLoading(false)
    }
  }

  // Сохранение контента
  const saveContent = async (section?: string) => {
    try {
      setSaving(true)
      
      if (section) {
        // Сохраняем конкретную секцию
        const sectionData = getNestedValue(editingContent, section)
        const response = await fetch('/api/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            locale: selectedLanguage,
            section,
            data: sectionData
          })
        })
        
        const result = await response.json()
        if (result.success) {
          // Обновляем локальное состояние
          _setContent(editingContent)
          addNotification('success', `Секция "${section}" успешно сохранена`)
        } else {
          console.error('Failed to save section:', result.error)
          addNotification('error', `Ошибка при сохранении секции "${section}"`)
        }
      } else {
        // Сохраняем весь контент
        const response = await fetch('/api/content', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            locale: selectedLanguage,
            data: editingContent
          })
        })
        
        const result = await response.json()
        if (result.success) {
          _setContent(editingContent)
          addNotification('success', 'Весь контент успешно сохранен')
        } else {
          console.error('Failed to save content:', result.error)
          addNotification('error', 'Ошибка при сохранении контента')
        }
      }
    } catch (error) {
      console.error('Error saving content:', error)
      addNotification('error', 'Ошибка при сохранении контента')
    } finally {
      setSaving(false)
    }
  }

  // Получение вложенного значения
  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : null
    }, obj)
  }

  // Установка вложенного значения
  const setNestedValue = (obj: any, path: string, value: any) => {
    const keys = path.split('.')
    const lastKey = keys.pop()
    const target = keys.reduce((current, key) => {
      if (!current[key]) {
        current[key] = {}
      }
      return current[key]
    }, obj)
    
    if (lastKey) {
      target[lastKey] = value
    }
    
    return obj
  }

  // Обновление поля
  const updateField = (path: string, value: any) => {
    const updated = { ...editingContent }
    setNestedValue(updated, path, value)
    setEditingContent(updated)
  }

  // Копирование контента с другого языка
  const copyFromLanguage = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/content?locale=${copyFromLanguageState}`)
      const result = await response.json()
      
      if (result.success) {
        setEditingContent(result.data)
        _setContent(result.data)
        setShowCopyModal(false)
        addNotification('success', 'Контент успешно скопирован')
      } else {
        console.error('Failed to copy content:', result.error)
        addNotification('error', 'Ошибка при копировании контента')
      }
    } catch (error) {
      console.error('Error copying content:', error)
      addNotification('error', 'Ошибка при копировании контента')
    } finally {
      setLoading(false)
    }
  }

  // Добавление уведомления
  const addNotification = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString()
    const notification = { id, type, message }
    setNotifications(prev => [...prev, notification])
    
    // Автоматическое удаление через 5 секунд
    setTimeout(() => {
      removeNotification(id)
    }, 5000)
  }

  // Удаление уведомления
  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  // Переключение секции
  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId)
    } else {
      newExpanded.add(sectionId)
    }
    setExpandedSections(newExpanded)
  }

  // Рендер поля ввода
  const renderField = (path: string, value: any, label: string, type: 'text' | 'textarea' = 'text') => {
    if (type === 'textarea') {
      return (
        <div key={path} className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            {label}
          </label>
          <textarea
            value={value || ''}
            onChange={(e) => updateField(path, e.target.value)}
            className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>
      )
    }

    return (
      <div key={path} className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
        <input
          type="text"
          value={value || ''}
          onChange={(e) => updateField(path, e.target.value)}
          className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    )
  }

  // Рендер секции контента
  const renderContentSection = (section: ContentSection) => {
    const isExpanded = expandedSections.has(section.id)
    const sectionData = getNestedValue(editingContent, section.path)
    
    if (!sectionData) return null

    return (
      <div key={section.id} className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden">
        {/* Заголовок секции */}
        <div 
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-dark-700 transition-colors"
          onClick={() => toggleSection(section.id)}
        >
          <div className="flex items-center space-x-3">
            <section.icon className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="text-lg font-semibold text-white">{section.name}</h3>
              <p className="text-sm text-gray-400">{section.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                saveContent(section.path)
              }}
              disabled={saving}
              className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span className="text-sm">Сохранить</span>
            </button>
            {isExpanded ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
          </div>
        </div>

        {/* Содержимое секции */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 border-t border-dark-700 space-y-4"
          >
            {renderSectionFields(section.path, sectionData)}
          </motion.div>
        )}
      </div>
    )
  }

  // Рендер полей секции
  const renderSectionFields = (path: string, data: any) => {
    const _fields: JSX.Element[] = []

    const processObject = (obj: any, currentPath: string, level: number = 0): JSX.Element[] => {
      const result: JSX.Element[] = []
      
      Object.entries(obj).forEach(([key, value]) => {
        const fieldPath = `${currentPath}.${key}`
        
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          // Вложенный объект
          const nestedFields = processObject(value, fieldPath, level + 1)
          result.push(
            <div key={fieldPath} className={`${level > 0 ? 'ml-4 border-l border-dark-600 pl-4' : ''}`}>
              <h4 className="text-md font-medium text-gray-300 mb-3 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </h4>
              {nestedFields}
            </div>
          )
        } else if (typeof value === 'string') {
          // Строковое поле
          const label = key.replace(/([A-Z])/g, ' $1').trim()
          const isLongText = value.length > 100
          
          result.push(
            <div key={fieldPath} className={`${level > 0 ? 'ml-4' : ''}`}>
              {renderField(fieldPath, value, label, isLongText ? 'textarea' : 'text')}
            </div>
          )
        }
      })
      
      return result
    }

    return processObject(data, path)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Загрузка контента...</p>
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
          <h1 className="text-3xl font-bold text-white">Управление контентом</h1>
          <p className="text-gray-400 mt-1">Редактирование текстов главной страницы</p>
        </div>
        <div className="flex items-center space-x-3">
          {/* Выбор языка */}
          <div className="flex items-center space-x-2">
            <Languages className="w-5 h-5 text-gray-400" />
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>

          {/* Кнопки действий */}
          <button
            onClick={() => setShowCopyModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Globe className="w-4 h-4" />
            <span>Копировать с языка</span>
          </button>
          
          <button
            onClick={() => setPreviewMode(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>Предварительный просмотр</span>
          </button>
          
          <button
            onClick={() => saveContent()}
            disabled={saving}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>Сохранить всё</span>
          </button>
          
          <button
            onClick={loadContent}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Обновить</span>
          </button>
        </div>
      </motion.div>

      {/* Секции контента */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        {contentSections.map(section => renderContentSection(section))}
      </motion.div>

      {/* Информация */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-dark-800 rounded-xl p-4 border border-dark-700"
      >
        <div className="text-center">
          <p className="text-sm text-gray-400">
            Изменения сохраняются в файлы переводов. Для применения изменений может потребоваться перезагрузка страницы.
          </p>
        </div>
      </motion.div>

      {/* Уведомления */}
      <ContentNotifications
        notifications={notifications}
        onRemove={removeNotification}
      />

      {/* Предварительный просмотр */}
      <ContentPreview
        content={editingContent}
        isOpen={previewMode}
        onClose={() => setPreviewMode(false)}
      />

      {/* Модальное окно копирования */}
      {showCopyModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setShowCopyModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-dark-800 rounded-xl p-6 border border-dark-700 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold text-white mb-4">Копировать контент</h3>
            <p className="text-gray-400 mb-4">
              Выберите язык, с которого хотите скопировать контент:
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Источник
                </label>
                <select
                  value={copyFromLanguageState}
                  onChange={(e) => setCopyFromLanguageState(e.target.value)}
                  className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {languages.filter(lang => lang.code !== selectedLanguage).map(lang => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => copyFromLanguage()}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Копирование...' : 'Копировать'}
                </button>
                <button
                  onClick={() => setShowCopyModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Отмена
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
