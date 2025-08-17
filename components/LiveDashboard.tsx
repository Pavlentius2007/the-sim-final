'use client'

import { motion } from 'framer-motion'
import { BarChart3, Video } from 'lucide-react'
import DashboardVideo from './DashboardVideo'

interface LiveDashboardProps {
  videoSrc?: string
  fallbackImage?: string
}

export default function LiveDashboard({ videoSrc, fallbackImage }: LiveDashboardProps) {

  return (
    <div className="relative">
      <motion.div 
        className="relative rounded-2xl overflow-hidden neon-border"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-gradient-to-br from-dark-800 to-dark-700 p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <h4 className="text-white font-semibold">Live Dashboard</h4>
                <p className="text-gray-400 text-xs">The SIM Platform</p>
              </div>
            </div>
            
            {/* Mode Indicator */}
            <div className="flex items-center space-x-2">
              <div className="flex bg-purple-500 rounded-lg px-3 py-1">
                <Video className="w-3 h-3 text-white mr-1" />
                <span className="text-white text-xs font-medium">Demo Mode</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-xs">Demo Active</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div 
            className="dashboard-video-container relative w-full h-64 sm:h-80 md:h-96 rounded-lg overflow-hidden"
            style={{ minHeight: '256px' }}
          >
            <DashboardVideo 
              videoSrc={videoSrc || "https://youtu.be/i6aw3SWLuas"} // Фолбэк на рабочую ссылку
              fallbackImage={fallbackImage}
            />
          </div>

          {/* Footer Info */}
          <div className="mt-4 text-center">
            <div>
              <p className="text-gray-400 text-sm">
                Демонстрация интерфейса дашборда
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Запись реального интерфейса для демонстрации возможностей
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
