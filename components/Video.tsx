'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Play, Video as VideoIcon } from 'lucide-react'
import React, { useState, useRef } from 'react'
import { useTranslations } from '@/hooks/useTranslations'
import { useParams } from 'next/navigation'

export default function Video() {
  const { t } = useTranslations()
  const params = useParams()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [showVideo, setShowVideo] = useState(false)
  const [selectedQuality, setSelectedQuality] = useState<'480p' | '720p' | '1080p'>('720p')
  const [currentLanguage, setCurrentLanguage] = useState('en')
  const videoRef = useRef<HTMLVideoElement>(null)

  // Получаем текущий язык с проверкой на клиенте
  React.useEffect(() => {
    if (params.locale) {
      setCurrentLanguage(params.locale as string)
    }
  }, [params.locale])

  // Прямые пути к видео файлам для каждого языка
  const getVideoPaths = (language: string) => {
    const basePath = `/videos/${language}/sim-overview`
    return {
      '480p': `${basePath}-480p.mp4`,
      '720p': `${basePath}-720p.mp4`,
      '1080p': `${basePath}-1080p.mp4`
    }
  }

  const videoPaths = getVideoPaths(currentLanguage)
  const currentVideoPath = videoPaths[selectedQuality]
  
  // Отладочная информация
  // Video component loaded
  

  // Логика установки первого кадра теперь в onLoadedMetadata

  return (
    <section ref={ref} className="relative py-20 px-4 sm:px-6 lg:px-8" suppressHydrationWarning>
      
      {/* Content */}
      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t('video.title')} <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">The SIM</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {t('video.subtitle')}
          </p>
        </motion.div>

        {/* Video Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
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
                    muted
                    loop
                    playsInline
                    poster="/images/dashboard-preview.jpg"
                    onLoadStart={() => {}}
                    onLoadedData={() => {}}
                    onLoadedMetadata={() => {
                      if (videoRef.current) {
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
                  
                  {/* Video Quality Options */}
                  <div className="absolute bottom-4 right-4 flex gap-2 z-10">
                    {(['480p', '720p', '1080p'] as const).map((quality) => (
                      <button
                        key={quality}
                        onClick={(e) => {
                          e.stopPropagation(); // Предотвращаем открытие модального окна
                          setSelectedQuality(quality);
                          // Сохраняем текущее время воспроизведения
                          const currentTime = videoRef.current?.currentTime || 0;
                          // После смены источника восстанавливаем время и воспроизведение
                          if (videoRef.current) {
                            const video = videoRef.current;
                            video.addEventListener('loadedmetadata', () => {
                              video.currentTime = currentTime;
                              video.play().catch(() => {
                                // Autoplay prevented after quality change
                              });
                            }, { once: true });
                          }
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all backdrop-blur-sm ${
                          selectedQuality === quality
                            ? 'bg-blue-500/90 text-white'
                            : 'bg-black/50 text-gray-300 hover:bg-black/70'
                        }`}
                      >
                        {quality}
                      </button>
                    ))}
                  </div>
                  
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
                        <div className="text-white font-semibold text-sm">{t('video.videoTitle')}</div>
                        <div className="text-gray-300 text-xs">{t('video.clickToView')}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Video Quality Options */}
              <div className="flex justify-center gap-2 mt-4">
                {(['480p', '720p', '1080p'] as const).map((quality) => (
                  <button
                    key={quality}
                    onClick={() => setSelectedQuality(quality)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      selectedQuality === quality
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {quality}
                  </button>
                ))}
              </div>
            </div>
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
                  <h4 className="text-lg text-white">
                    {t('video.whatYouLearn.features.overview.title')}
                  </h4>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                </div>
                <div>
                  <h4 className="text-lg text-white">
                    {t('video.whatYouLearn.features.features.title')}
                  </h4>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                </div>
                <div>
                  <h4 className="text-lg text-white">
                    {t('video.whatYouLearn.features.dashboard.title')}
                  </h4>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                </div>
                <div>
                  <h4 className="text-lg text-white">
                    {t('video.whatYouLearn.features.diversification.title')}
                  </h4>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                </div>
                <div>
                  <h4 className="text-lg text-white">
                    {t('video.whatYouLearn.features.api.title')}
                  </h4>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                </div>
                <div>
                  <h4 className="text-lg text-white">
                    {t('video.whatYouLearn.features.income.title')}
                  </h4>
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
              <Play className="w-6 h-6" />
              {t('video.watchVideo')}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Video Modal */}
      {showVideo && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-dark-800 rounded-2xl overflow-hidden">
            <button
              onClick={() => setShowVideo(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
            >
              ×
            </button>
            <video
              className="w-full aspect-video"
              controls
              autoPlay
              src={currentVideoPath}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
    </section>
  )
}