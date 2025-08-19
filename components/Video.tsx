'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Play, Video as VideoIcon, Settings, Clock, Globe } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useTranslations } from '@/hooks/useTranslations'
import { useParams } from 'next/navigation'
import { VideoData } from '@/lib/types'

export default function Video() {
  const { t } = useTranslations()
  const params = useParams()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [showVideo, setShowVideo] = useState(false)
  const [currentVideo, setCurrentVideo] = useState<VideoData | null>(null)
  const [_videos, setVideos] = useState<VideoData[]>([])
  const [loading, setLoading] = useState(true)
  const [_selectedQuality, _setSelectedQuality] = useState<'480p' | '720p' | '1080p'>('720p')

  // Получаем текущий язык
  const currentLanguage = params.locale as string || 'en'

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true)
              try {
          // console.log('Fetching videos for language:', currentLanguage)
          const response = await fetch(`/api/videos?language=${currentLanguage}`)
          const data = await response.json()
          
                  // console.log('Received video data:', data)
          
          if (data.videos && data.videos.length > 0) {
            setVideos(data.videos)
            setCurrentVideo(data.videos[0]) // Показываем первое видео
                        // console.log('Set current video:', data.videos[0])
          } else {
            setCurrentVideo(null)
                        // console.log('No videos found for language:', currentLanguage)
          }
      } catch (error) {
        console.error('Failed to fetch videos:', error)
        setCurrentVideo(null)
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [currentLanguage])

  // Получаем URL для YouTube видео (улучшенная версия)
  const getVideoUrl = (video: VideoData, _quality: string) => {
    if (video.videoType === 'youtube' && video.youtubeUrl) {
      console.log('🔗 Original URL:', video.youtubeUrl)
      
      let videoId = ''
      
      // Извлекаем video ID из разных форматов YouTube URL
      if (video.youtubeUrl.includes('youtube.com/watch?v=')) {
        videoId = video.youtubeUrl.split('v=')[1]?.split('&')[0] || ''
      } else if (video.youtubeUrl.includes('youtu.be/')) {
        videoId = video.youtubeUrl.split('youtu.be/')[1]?.split('?')[0] || ''
      } else if (video.youtubeUrl.includes('youtube.com/embed/')) {
        videoId = video.youtubeUrl.split('embed/')[1]?.split('?')[0] || ''
      }
      
      if (videoId) {
        const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`
        console.log('🎥 Embed URL:', embedUrl)
        return embedUrl
      }
      
      console.warn('❌ Could not extract video ID from:', video.youtubeUrl)
    }
    return ''
  }

  // Получаем доступные качества (для YouTube всегда доступно)
  const _getAvailableQualities = (video: VideoData) => {
    if (video.videoType === 'youtube') {
      return ['720p'] // YouTube автоматически выбирает лучшее качество
    }
    return ['720p']
  }

  // Получаем название качества
  const _getQualityLabel = (quality: string) => {
    switch (quality) {
      case '480p': return '480p'
      case '720p': return '720p'
      case '1080p': return '1080p'
      default: return quality
    }
  }

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/10 to-slate-900"></div>
        
        {/* Floating Elements */}
        <motion.div
          className="absolute top-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full blur-xl"
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-24 h-24 bg-purple-500/10 rounded-full blur-xl"
          animate={{
            y: [0, 20, 0],
            x: [0, -15, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t('video.title')} <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">The SIM</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {t('video.subtitle')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          {/* Video Thumbnail */}
          <div className="relative">
            {loading ? (
              <div className="relative rounded-2xl overflow-hidden neon-border">
                <div className="aspect-video bg-gradient-to-br from-dark-700 to-dark-600 relative flex items-center justify-center">
                  <div className="text-white">Загрузка...</div>
                </div>
              </div>
            ) : currentVideo ? (
              <div className="video-preview-container relative rounded-2xl overflow-hidden shadow-2xl border border-gray-700/30">
                <div 
                  className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 relative group cursor-pointer overflow-hidden" 
                  onClick={() => setShowVideo(true)}
                >
                  {/* Video Thumbnail Background */}
                  <div className="w-full h-full bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-indigo-600/20 relative">
                    {/* Реальное превью YouTube */}
                    {currentVideo.thumbnail && (
                      <img 
                        src={currentVideo.thumbnail} 
                        alt={currentVideo.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-40"
                        loading="lazy"
                      />
                    )}
                    
                    {/* Градиент поверх превью */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-purple-600/30 to-indigo-600/30"></div>
                    
                    {/* Floating Elements */}
                    <div className="float-animation absolute top-1/4 left-1/4 w-16 h-16 bg-blue-500/10 rounded-full blur-lg"></div>
                    <div className="float-animation float-animation-delay-1 absolute bottom-1/4 right-1/4 w-20 h-20 bg-purple-500/10 rounded-full blur-lg"></div>
                    <div className="float-animation float-animation-delay-2 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl"></div>
                    
                    {/* Central Icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative">
                        <div className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
                          <VideoIcon className="w-12 h-12 text-white/80" />
                        </div>
                        {/* Glow Effect */}
                        <div className="absolute inset-0 w-24 h-24 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="relative w-24 h-24 bg-gradient-to-r from-blue-500/90 to-purple-600/90 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/40 shadow-2xl"
                    >
                      <Play className="w-10 h-10 text-white ml-1" />
                      {/* Glow Effect */}
                      <div className="absolute inset-0 w-24 h-24 bg-blue-500/30 rounded-full blur-xl animate-pulse"></div>
                      {/* Inner Glow */}
                      <div className="absolute inset-2 w-20 h-20 bg-white/20 rounded-full"></div>
                    </motion.div>
                  </div>
                  
                  {/* Video Info */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-black/60 backdrop-blur-md rounded-xl p-4 border border-white/30 shadow-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                          <VideoIcon className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="text-white font-semibold text-sm">{currentVideo.title}</div>
                          <div className="text-gray-300 text-xs">Нажмите для просмотра</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                </div>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden neon-border">
                <div className="aspect-video bg-gradient-to-br from-dark-700 to-dark-600 relative flex items-center justify-center">
                  <div className="text-white text-center">
                    <VideoIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p>Видео недоступно для этого языка</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Video Stats */}
            {currentVideo && (
              <div className="mt-8 grid grid-cols-3 gap-4">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-center bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md rounded-2xl p-5 border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-1">{currentVideo.duration}</div>
                  <div className="text-sm text-gray-400">{t('video.durationLabel')}</div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-center bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md rounded-2xl p-5 border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Settings className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent mb-1">{currentVideo.quality}</div>
                  <div className="text-sm text-gray-400">{t('video.qualityLabel')}</div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-center bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md rounded-2xl p-5 border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Globe className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent mb-1">{currentVideo.language}</div>
                  <div className="text-sm text-gray-400">{t('video.languageLabel')}</div>
                </motion.div>
              </div>
            )}
          </div>

          {/* Video Description */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-6">
              {t('video.whatYouLearn.title')}
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">
                    {t('video.whatYouLearn.features.overview.title')}
                  </h4>
                  <p className="text-gray-400">
                    {t('video.whatYouLearn.features.overview.description')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">
                    {t('video.whatYouLearn.features.features.title')}
                  </h4>
                  <p className="text-gray-400">
                    {t('video.whatYouLearn.features.features.description')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">
                    {t('video.whatYouLearn.features.dashboard.title')}
                  </h4>
                  <p className="text-gray-400">
                    {t('video.whatYouLearn.features.dashboard.description')}
                  </p>
                </div>
              </div>
            </div>
            
            {/* CTA Button */}
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="relative bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-600 text-white px-10 py-5 rounded-2xl font-semibold shadow-2xl shadow-blue-500/30 hover:shadow-3xl hover:shadow-blue-500/40 transition-all duration-300 flex items-center gap-4 overflow-hidden group"
              onClick={() => setShowVideo(true)}
            >
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Content */}
              <div className="relative flex items-center gap-4">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Play className="w-4 h-4 text-white ml-0.5" />
                </div>
                <span className="text-lg">{t('video.watchVideo')}</span>
              </div>
              
              {/* Shine Effect */}
              <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </motion.button>
          </div>
        </motion.div>
      </div>



      {/* Video Modal */}
      {showVideo && currentVideo && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-5xl my-8">
            <button
              onClick={() => setShowVideo(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 text-2xl z-10 bg-gray-800/80 backdrop-blur-sm rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-700/80 transition-all duration-200"
            >
              ✕
            </button>
            
            {/* Quality Selector - для YouTube не нужен */}
            
            <div className="aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-700/50">
              {currentVideo.videoType === 'youtube' ? (
                <>
                  <iframe
                    src={getVideoUrl(currentVideo, _selectedQuality)}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    title={currentVideo.title}
                    loading="lazy"
                  />
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white">
                  <div className="text-center">
                    <VideoIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p>Видео недоступно</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-6 text-white bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/30">
              <h3 className="text-2xl font-bold mb-3 text-white">{currentVideo.title}</h3>
              <p className="text-gray-300 text-lg leading-relaxed mb-4">{currentVideo.description}</p>
              {currentVideo.videoType === 'youtube' && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      if (currentVideo.youtubeUrl) {
                        window.open(currentVideo.youtubeUrl, '_blank')
                      }
                    }}
                    className="flex items-center gap-2 bg-red-500/20 px-3 py-2 rounded-lg border border-red-500/30 hover:bg-red-500/30 transition-colors duration-200 cursor-pointer"
                  >
                    <VideoIcon className="w-4 h-4 text-red-400" />
                    <span className="text-red-400 font-medium">YouTube</span>
                  </button>
                  <div className="flex items-center gap-2 bg-gray-700/50 px-3 py-2 rounded-lg">
                    <VideoIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300 text-sm">Длительность: {currentVideo.duration}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
} 