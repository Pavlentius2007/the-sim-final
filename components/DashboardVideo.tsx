'use client'

import { useState } from 'react'

interface DashboardVideoProps {
  videoSrc: string
  fallbackImage?: string
}

// Функция для извлечения YouTube ID
const extractYouTubeId = (url: string): string => {
  if (url.includes('youtube.com/watch?v=')) {
    return url.split('v=')[1]?.split('&')[0] || ''
  } else if (url.includes('youtu.be/')) {
    return url.split('youtu.be/')[1]?.split('?')[0] || ''
  }
  return ''
}

// Проверяем, является ли URL YouTube ссылкой
const isYouTubeUrl = (url: string): boolean => {
  return url.includes('youtube.com') || url.includes('youtu.be')
}

export default function DashboardVideo({ videoSrc, fallbackImage }: DashboardVideoProps) {
  const [hasError, setHasError] = useState(false)
  
  const isYoutube = isYouTubeUrl(videoSrc)
  const youtubeId = isYoutube ? extractYouTubeId(videoSrc) : ''
  
  // Настройки для автовоспроизведения YouTube
  const embedUrl = isYoutube ? 
    `https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0&modestbranding=1&rel=0&showinfo=0&fs=0&disablekb=1` : 
    videoSrc

  console.log('🎬 Dashboard Video:', { videoSrc, isYoutube, youtubeId, embedUrl })

  return (
    <div 
      className="dashboard-video-container relative w-full h-64 sm:h-80 md:h-96 rounded-lg overflow-hidden bg-dark-700"
      style={{ minHeight: '256px' }}
    >
      {/* Overlay Info */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-white text-sm font-medium bg-black/70 px-2 py-1 rounded backdrop-blur-sm">Live Demo</span>
        </div>
        <div className="text-white text-xs bg-black/70 px-2 py-1 rounded backdrop-blur-sm">
          The SIM Dashboard
        </div>
      </div>

      {/* YouTube iframe */}
      {isYoutube && youtubeId ? (
        <iframe
          src={embedUrl}
          className="w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Dashboard Demo"
          onLoad={() => console.log('✅ Dashboard iframe loaded')}
          onError={() => {
            console.error('❌ Dashboard iframe error')
            setHasError(true)
          }}
        />
      ) : (
        /* MP4 видео для fallback */
        <div className="w-full h-full flex items-center justify-center">
          {videoSrc ? (
            <video
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              poster={fallbackImage}
              onError={() => setHasError(true)}
            >
              <source src={videoSrc} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400 text-sm">Загрузка...</p>
            </div>
          )}
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-900/20 backdrop-blur-sm">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-400 text-2xl">⚠️</span>
            </div>
            <p className="text-red-400 text-sm mb-2">Ошибка загрузки видео</p>
            <p className="text-red-500 text-xs">Проверьте настройки видео в YouTube</p>
          </div>
        </div>
      )}

      {/* Bottom Info Bar */}
      <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
        <div className="text-white text-xs bg-black/70 px-3 py-2 rounded-full backdrop-blur-sm text-center">
          Демонстрация интерфейса дашборда
        </div>
      </div>
    </div>
  )
}
