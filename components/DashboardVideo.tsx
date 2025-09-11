'use client'

import React, { useRef, useState, useEffect } from 'react'
import { Play, Pause } from 'lucide-react'

interface DashboardVideoProps {
  videoSrc: string
  fallbackImage: string
}

export default function DashboardVideo({ videoSrc, fallbackImage }: DashboardVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [hasError, setHasError] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const handleError = () => {
    console.error("Video failed to load or play:", videoSrc)
    setHasError(true)
  }

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play()
        setIsPlaying(true)
      } else {
        videoRef.current.pause()
        setIsPlaying(false)
      }
    }
  }

  // Настройка видео при монтировании
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Настройка атрибутов видео
    video.muted = true
    video.playsInline = true
    video.loop = true
    video.preload = "auto" // Изменено на auto для принудительной загрузки
    
    // Обработчики событий
    const handleLoadedData = () => {
      setIsLoading(false)
      video.play().then(() => {
        setIsPlaying(true)
      }).catch((_error) => {
        // console.log("Autoplay prevented:", error)
        setIsLoading(false)
      })
    }
    
    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    
    // Добавляем обработчики
    video.addEventListener('loadeddata', handleLoadedData)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    
    // Принудительная загрузка видео
    video.load()
    
    // Очистка при размонтировании
    return () => {
      video.removeEventListener('loadeddata', handleLoadedData)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
    }
  }, [videoSrc])

  if (hasError) {
    return (
      <div className="relative rounded-xl overflow-hidden bg-gray-800 border-2 border-blue-500/30 shadow-2xl">
        <img
          src={fallbackImage}
          alt="Dashboard Preview Fallback"
          className="w-full h-auto object-cover"
        />
        <p className="absolute inset-0 flex items-center justify-center text-red-400 bg-black bg-opacity-50">
          Error loading video.
        </p>
      </div>
    )
  }

  return (
    <div className="relative rounded-xl overflow-hidden bg-gray-800 border-2 border-blue-500/30 shadow-2xl group">
      <video
        ref={videoRef}
        src={videoSrc}
        poster={fallbackImage}
        muted
        loop
        playsInline
        preload="metadata"
        className="w-full h-auto object-cover"
        onError={handleError}
      />
      
      {/* Overlay с кнопкой воспроизведения */}
      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={togglePlay}
          className="bg-blue-500/90 hover:bg-blue-600/90 text-white rounded-full p-4 shadow-2xl transition-all duration-300 hover:scale-110"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : isPlaying ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6 ml-1" />
          )}
        </button>
      </div>
      
      {/* Индикатор загрузки */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-white text-sm">Загрузка демо...</div>
        </div>
      )}
    </div>
  )
}
