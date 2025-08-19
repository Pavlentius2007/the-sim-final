'use client'

import { useState, useRef } from 'react'
import { Upload, Video, Settings as _Settings, X, Check } from 'lucide-react'
import { VideoData } from '@/lib/types'

interface VideoUploadProps {
  onVideoCreated?: (video: VideoData) => void
  languageCode: string
}

export default function VideoUpload({ onVideoCreated, languageCode }: VideoUploadProps) {
  const [videoType, setVideoType] = useState<'youtube' | 'local'>('local')
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({})
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    youtubeUrl: '',
    duration: '',
    quality: 'HD',
    language: '',
    languageCode: languageCode
  })
  
  const fileInputRefs = useRef<{[key: string]: HTMLInputElement | null}>({
    hd: null,
    fullhd: null,
    ultra: null
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileSelect = (quality: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
              // console.log(`Selected ${quality} file:`, file.name)
      // Здесь можно добавить предварительную валидацию файла
    }
  }

  const uploadVideoFile = async (quality: string, file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('video', file)
    formData.append('metadata', JSON.stringify({
      videoId: Date.now().toString(),
      languageCode: languageCode,
      quality: quality
    }))

    const response = await fetch('/api/videos/upload', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error(`Upload failed for ${quality}`)
    }

    const data = await response.json()
    return data.videoUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)
    
    try {
      if (videoType === 'local') {
        // Загружаем локальные видео для всех качеств
        const localVideos: {[key: string]: string} = {}
        
        for (const quality of ['hd', 'fullhd', 'ultra']) {
          const fileInput = fileInputRefs.current[quality]
          if (fileInput?.files?.[0]) {
            setUploadProgress(prev => ({ ...prev, [quality]: 0 }))
            
            try {
              const videoUrl = await uploadVideoFile(quality, fileInput.files[0])
              localVideos[quality] = videoUrl
              setUploadProgress(prev => ({ ...prev, [quality]: 100 }))
            } catch (error) {
              console.error(`Failed to upload ${quality}:`, error)
              setUploadProgress(prev => ({ ...prev, [quality]: -1 }))
            }
          }
        }

        // Создаем видео в базе
        const videoData = {
          ...formData,
          localVideos,
          videoType: 'local' as const
        }

        const response = await fetch('/api/videos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(videoData)
        })

        if (response.ok) {
          const newVideo = await response.json()
          onVideoCreated?.(newVideo.video)
          resetForm()
        }
      } else {
        // Сохраняем YouTube ссылку
        const videoData = {
          ...formData,
          videoType: 'youtube' as const
        }

        const response = await fetch('/api/videos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(videoData)
        })

        if (response.ok) {
          const newVideo = await response.json()
          onVideoCreated?.(newVideo.video)
          resetForm()
        }
      }
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      youtubeUrl: '',
      duration: '',
      quality: 'HD',
      language: '',
      languageCode: languageCode
    })
    setUploadProgress({})
    // Сбрасываем input файлы
    Object.values(fileInputRefs.current).forEach(ref => {
      if (ref) ref.value = ''
    })
  }

  const getQualityLabel = (quality: string) => {
    switch (quality) {
      case 'hd': return '720p (HD)'
      case 'fullhd': return '1080p (Full HD)'
      case 'ultra': return '4K (Ultra HD)'
      default: return quality
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress === -1) return 'text-red-500'
    if (progress === 100) return 'text-green-500'
    return 'text-blue-500'
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Загрузка видео</h3>
        <button
          onClick={resetForm}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Переключатель типа видео */}
      <div className="flex space-x-4 mb-6">
        <button
          type="button"
          onClick={() => setVideoType('local')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            videoType === 'local' 
              ? 'bg-primary-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <Video className="w-5 h-5" />
          <span>Локальное видео</span>
        </button>
        <button
          type="button"
          onClick={() => setVideoType('youtube')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            videoType === 'youtube' 
              ? 'bg-primary-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <Upload className="w-5 h-5" />
          <span>YouTube ссылка</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Основные поля */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Название видео *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Введите название видео"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Длительность *
            </label>
            <input
              type="text"
              required
              value={formData.duration}
              onChange={(e) => handleInputChange('duration', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="2:25"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Описание *
          </label>
          <textarea
            required
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Опишите содержимое видео"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Язык *
            </label>
            <input
              type="text"
              required
              value={formData.language}
              onChange={(e) => handleInputChange('language', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Русский"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Качество *
            </label>
            <select
              value={formData.quality}
              onChange={(e) => handleInputChange('quality', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="HD">HD</option>
              <option value="Full HD">Full HD</option>
              <option value="4K">4K</option>
            </select>
          </div>
        </div>

        {/* Поля в зависимости от типа видео */}
        {videoType === 'youtube' ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              YouTube URL *
            </label>
            <input
              type="url"
              required
              value={formData.youtubeUrl}
              onChange={(e) => handleInputChange('youtubeUrl', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>
        ) : (
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900">Загрузка видео файлов</h4>
            
            {(['hd', 'fullhd', 'ultra'] as const).map((quality) => (
              <div key={quality} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {getQualityLabel(quality)}
                    </span>
                  </label>
                  
                  {/* Прогресс загрузки */}
                  {uploadProgress[quality] !== undefined && (
                    <div className={`flex items-center space-x-2 ${getProgressColor(uploadProgress[quality])}`}>
                      {uploadProgress[quality] === 100 ? (
                        <Check className="w-4 h-4" />
                      ) : uploadProgress[quality] === -1 ? (
                        <X className="w-4 h-4" />
                      ) : (
                        <span className="text-xs">{uploadProgress[quality]}%</span>
                      )}
                    </div>
                  )}
                </div>
                
                <input
                  ref={(el) => { fileInputRefs.current[quality] = el }}
                  type="file"
                  accept="video/*"
                  onChange={(e) => handleFileSelect(quality, e)}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                />
                
                <p className="text-xs text-gray-500 mt-1">
                  Поддерживаемые форматы: MP4, WebM, MOV. Максимальный размер: 500MB
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Кнопка отправки */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={resetForm}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={uploading}
            className="px-6 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {uploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Загрузка...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Загрузить видео</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
