'use client'

import { useState, useRef, useEffect } from 'react'
import { useTranslations } from '@/hooks/useTranslations'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'

type VideoQuality = '480p' | '720p' | '1080p'

export default function Video() {
  const { t } = useTranslations()
  const [showVideo, setShowVideo] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false) // Звук включен по умолчанию
  const [selectedQuality, setSelectedQuality] = useState<VideoQuality>('1080p')
  const videoRef = useRef<HTMLVideoElement>(null)

  // Получаем locale из URL
  const locale = typeof window !== 'undefined' ? window.location.pathname.split('/')[1] || 'ru' : 'ru'

  // Пути к видео для разных языков
  const videoPaths: Record<VideoQuality, string> = {
    '480p': `/videos/${locale}/sim-overview-480p.mp4`,
    '720p': `/videos/${locale}/sim-overview-720p.mp4`,
    '1080p': `/videos/${locale}/sim-overview-1080p.mp4`
  }

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
    }
  }

  const handleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleQualityChange = (quality: VideoQuality) => {
    setSelectedQuality(quality)
    if (videoRef.current) {
      videoRef.current.src = videoPaths[quality]
      videoRef.current.load()
    }
  }

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleLoadedData = () => {
      // Принудительно включаем звук
      video.muted = false
      setIsMuted(false)
      video.play().catch(() => {
        // Autoplay prevented
      })
    }

    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('loadeddata', handleLoadedData)

    return () => {
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('loadeddata', handleLoadedData)
    }
  }, [selectedQuality])

  if (showVideo) {
    return (
      <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-6xl">
          <button
            onClick={() => setShowVideo(false)}
            className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
          >
             {t('video.close', 'Закрыть')}
          </button>
          
          <div className="relative bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              className="w-full h-auto"
              controls
              autoPlay
              muted={isMuted}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            >
              <source src={videoPaths[selectedQuality]} type="video/mp4" />
            </video>
            
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePlayPause}
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </button>
                
                <button
                  onClick={handleMute}
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                </button>
              </div>
              
              <div className="flex items-center gap-2">
                <select
                  value={selectedQuality}
                  onChange={(e) => handleQualityChange(e.target.value as VideoQuality)}
                  className="bg-gray-800 text-white px-3 py-1 rounded"
                >
                  <option value="480p">480p</option>
                  <option value="720p">720p</option>
                  <option value="1080p">1080p</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t('video.title', 'Видеообзор')} <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">The SIM</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {t('video.subtitle', 'Посмотрите, как работает наша платформа для управления цифровыми активами')}
          </p>
        </div>

        {/* Video Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Video Thumbnail */}
          <div className="relative">
            <div className="video-preview-container relative rounded-2xl overflow-hidden shadow-2xl border border-gray-700/30">
              <div
                className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 relative group cursor-pointer overflow-hidden"
                onClick={() => setShowVideo(true)}
              >
                {/* Video Thumbnail Background */}
                <div className="w-full h-full bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-indigo-600/20 relative">
                  {/* Видео с автовоспроизведением */}
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-300"
                    autoPlay
                    muted={false} // Звук включен
                    loop
                    playsInline
                    preload="auto" // Полная загрузка для мобильных
                    poster="/images/dashboard-preview.jpg"
                    onLoadStart={() => {}}
                    onLoadedData={() => {}}
                    onLoadedMetadata={() => {
                      if (videoRef.current) {
                        videoRef.current.muted = false // Принудительно включаем звук
                        videoRef.current.play().catch(() => {
                          // Autoplay prevented
                        });
                      }
                    }}
                    onError={(_e) => {
                      // Video error handled
                    }}
                  >
                    <source src={videoPaths[selectedQuality]} type="video/mp4" />
                  </video>
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
                      <Play className="w-8 h-8 text-white ml-1" />
                    </div>
                  </div>
                  
                  {/* Quality Badge */}
                  <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1">
                    <span className="text-white text-sm font-medium">{selectedQuality}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-2xl md:text-3xl font-bold text-white">
                {t('video.contentTitle', 'Полный обзор платформы')}
              </h3>
              <p className="text-lg text-gray-300 leading-relaxed">
                {t('video.contentDescription', 'Узнайте, как наша платформа помогает инвесторам управлять цифровыми активами с максимальной эффективностью и безопасностью.')}
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-xl font-semibold text-white">{t('video.whatYouWillSee', 'Что вы увидите:')}</h4>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  {t('video.feature1', 'Интерфейс личного кабинета')}
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  {t('video.feature2', 'Процесс инвестирования')}
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  {t('video.feature3', 'Аналитические инструменты')}
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  {t('video.feature4', 'Система безопасности')}
                </li>
              </ul>
            </div>

            <button
              onClick={() => setShowVideo(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105"
            >
              <Play className="w-5 h-5" />
              {t('video.watchButton', 'Смотреть видео')}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
