'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Clock, 
  Settings,
  Youtube
} from 'lucide-react'
import { VideoData, VideoFormData } from '@/lib/types'
import { validateYouTubeUrl } from '@/utils/videoUtils'

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'th', name: 'ไทย', flag: '🇹🇭' }
]

export default function AdminVideos() {
  const [videos, setVideos] = useState<VideoData[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingVideo, setEditingVideo] = useState<VideoData | null>(null)
  const [formData, setFormData] = useState<VideoFormData>({
    title: '',
    description: '',
    youtubeUrl: '',
    language: '',
    languageCode: '',
    duration: '',
    quality: 'HD'
  })

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    try {
      const response = await fetch('/api/videos')
      const data = await response.json()
      
      // Объединяем все видео из всех языков
      const allVideos: VideoData[] = []
      Object.values(data.videos).forEach((languageVideos: unknown) => {
        if (Array.isArray(languageVideos)) {
          allVideos.push(...(languageVideos as VideoData[]))
        }
      })
      
      setVideos(allVideos)
    } catch (error) {
      console.error('Failed to fetch videos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateYouTubeUrl(formData.youtubeUrl)) {
      alert('Пожалуйста, введите корректную ссылку на YouTube видео')
      return
    }

    try {
      const url = editingVideo ? `/api/videos` : '/api/videos'
      const method = editingVideo ? 'PUT' : 'POST'
      const body = editingVideo 
        ? { ...formData, id: editingVideo.id, languageCode: formData.languageCode }
        : formData

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (response.ok) {
        setShowForm(false)
        setEditingVideo(null)
        resetForm()
        fetchVideos()
      }
    } catch (error) {
      console.error('Failed to save video:', error)
    }
  }

  const handleDelete = async (video: VideoData) => {
    if (!confirm('Вы уверены, что хотите удалить это видео?')) return

    try {
      const response = await fetch(`/api/videos?id=${video.id}&languageCode=${video.languageCode}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchVideos()
      }
    } catch (error) {
      console.error('Failed to delete video:', error)
    }
  }

  const handleEdit = (video: VideoData) => {
    setEditingVideo(video)
    setFormData({
      title: video.title,
      description: video.description,
      youtubeUrl: video.youtubeUrl || '',
      language: video.language,
      languageCode: video.languageCode,
      duration: video.duration,
      quality: video.quality
    })
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      youtubeUrl: '',
      language: '',
      languageCode: '',
      duration: '',
      quality: 'HD'
    })
  }

  const openForm = () => {
    setShowForm(true)
    setEditingVideo(null)
    resetForm()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Загрузка видео...</p>
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
          <h1 className="text-3xl font-bold text-white">Видео</h1>
          <p className="text-gray-400 mt-1">Управление видео контентом</p>
        </div>
        <button
          onClick={openForm}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Добавить видео</span>
        </button>
      </motion.div>

      {/* Форма добавления/редактирования */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-dark-800 rounded-xl p-6 border border-dark-700"
        >
          <h3 className="text-xl font-semibold text-white mb-4">
            {editingVideo ? 'Редактировать видео' : 'Добавить новое видео'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Название
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Язык
                </label>
                <select
                  value={formData.languageCode}
                  onChange={(e) => {
                    const lang = languages.find(l => l.code === e.target.value)
                    setFormData({
                      ...formData, 
                      languageCode: e.target.value,
                      language: lang ? lang.name : ''
                    })
                  }}
                  className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Выберите язык</option>
                  {languages.map(lang => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                YouTube URL
              </label>
              <input
                type="url"
                value={formData.youtubeUrl}
                onChange={(e) => setFormData({...formData, youtubeUrl: e.target.value})}
                className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://www.youtube.com/watch?v=..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Описание
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Длительность
                </label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="5:30"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Качество
                </label>
                <select
                  value={formData.quality}
                  onChange={(e) => setFormData({...formData, quality: e.target.value})}
                  className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="HD">HD</option>
                  <option value="4K">4K</option>
                  <option value="1080p">1080p</option>
                  <option value="720p">720p</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                {editingVideo ? 'Обновить' : 'Добавить'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Отмена
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Список видео */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {videos.map((video) => (
          <div key={`${video.id}-${video.languageCode}`} className="bg-dark-800 rounded-xl p-6 border border-dark-700">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{languages.find(l => l.code === video.languageCode)?.flag}</span>
                <span className="text-white font-medium">{video.language}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEdit(video)}
                  className="text-blue-400 hover:text-blue-300"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(video)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-white mb-2">{video.title}</h3>
            <p className="text-gray-400 text-sm mb-4 line-clamp-2">{video.description}</p>
            
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{video.duration}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Settings className="w-4 h-4" />
                <span>{video.quality}</span>
              </div>
            </div>
            
            <div className="mt-4">
              <a
                href={video.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Youtube className="w-4 h-4" />
                <span>Смотреть на YouTube</span>
              </a>
            </div>
          </div>
        ))}
      </motion.div>

      {videos.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Youtube className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Видео не найдены</p>
          <p className="text-gray-500">Добавьте первое видео для начала работы</p>
        </motion.div>
      )}
    </div>
  )
}
