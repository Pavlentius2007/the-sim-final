'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, FileText, Clock, User as _User } from 'lucide-react'

interface QuickNotesEditProps {
  currentNotes: string
  onNotesChange: (newNotes: string) => void
  onClose: () => void
  leadName: string
}

const noteTemplates = [
  'Связались по телефону, клиент заинтересован',
  'Отправили презентацию и условия',
  'Запланировали демо-встречу',
  'Клиент просит дополнительную информацию',
  'Обсудили условия сотрудничества',
  'Клиент готов к инвестированию',
  'Требуется перезвонить через неделю',
  'Отправлено приглашение на вебинар'
]

export default function QuickNotesEdit({ currentNotes, onNotesChange, onClose, leadName }: QuickNotesEditProps) {
  const [notes, setNotes] = useState(currentNotes)
  const [showTemplates, setShowTemplates] = useState(false)

  const handleSave = () => {
    if (notes !== currentNotes) {
      onNotesChange(notes)
    }
    onClose()
  }

  const addTemplate = (template: string) => {
    const separator = notes.trim() ? '\n\n' : ''
    setNotes(notes + separator + template)
    setShowTemplates(false)
  }

  const addTimestamp = () => {
    const now = new Date().toLocaleString('ru-RU')
    const separator = notes.trim() ? '\n\n' : ''
    setNotes(notes + separator + `[${now}] `)
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
          className="bg-dark-800 rounded-xl border border-dark-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Заголовок */}
          <div className="flex items-center justify-between p-4 border-b border-dark-700">
            <div>
              <h3 className="text-lg font-semibold text-white">Редактировать заметки</h3>
              <p className="text-sm text-gray-400">Клиент: {leadName}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Инструменты */}
          <div className="p-4 border-b border-dark-700 bg-dark-700/30">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowTemplates(!showTemplates)}
                className="flex items-center space-x-2 px-3 py-2 bg-dark-600 hover:bg-dark-500 rounded-lg text-white transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span>Шаблоны</span>
              </button>
              
              <button
                onClick={addTimestamp}
                className="flex items-center space-x-2 px-3 py-2 bg-dark-600 hover:bg-dark-500 rounded-lg text-white transition-colors"
              >
                <Clock className="w-4 h-4" />
                <span>Добавить время</span>
              </button>
            </div>

            {/* Шаблоны заметок */}
            {showTemplates && (
              <div className="mt-3 p-3 bg-dark-600 rounded-lg">
                <p className="text-sm text-gray-300 mb-2">Выберите шаблон:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {noteTemplates.map((template, index) => (
                    <button
                      key={index}
                      onClick={() => addTemplate(template)}
                      className="text-left p-2 text-sm text-gray-300 hover:text-white hover:bg-dark-500 rounded transition-colors"
                    >
                      {template}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Поле заметок */}
          <div className="p-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <FileText className="w-4 h-4 inline mr-2" />
              Заметки менеджера
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={12}
              className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Введите заметки о клиенте..."
            />
            <div className="mt-2 text-xs text-gray-400">
              {notes.length} символов
            </div>
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
              disabled={notes === currentNotes}
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
