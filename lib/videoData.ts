import { VideoData } from './types'

// Расширенная структура данных для видео с поддержкой разных качеств
export interface ExtendedVideoData extends VideoData {
  qualities: {
    '480p': string
    '720p': string
    '1080p': string
  }
}

// Данные о видео для всех языков и качеств
export const videoData: { [languageCode: string]: ExtendedVideoData[] } = {
  'en': [
    {
      id: '1',
      title: 'The SIM - Complete Platform Overview',
      description: 'Learn how our platform works and how it can help you invest safely',
      youtubeUrl: '/videos/en/sim-overview-720p.mp4', // 720p как основное
      thumbnail: '/videos/en/sim-overview-480p.mp4', // Используем 480p для превью
      duration: '2:25',
      quality: 'HD',
      language: 'English',
      languageCode: 'en',
      createdAt: '2024-01-15T10:00:00Z',
      isActive: true,
      videoType: 'local',
      qualities: {
        '480p': '/videos/en/sim-overview-480p.mp4',
        '720p': '/videos/en/sim-overview-720p.mp4',
        '1080p': '/videos/en/sim-overview-1080p.mp4'
      }
    }
  ],
  'zh': [
    {
      id: '2',
      title: 'The SIM - 完整平台概述',
      description: '了解我们平台如何工作以及如何帮助您安全投资',
      youtubeUrl: '/videos/zh/sim-overview-720p.mp4', // 720p как основное
      thumbnail: '/videos/zh/sim-overview-480p.mp4', // Используем 480p для превью
      duration: '2:25',
      quality: '高清',
      language: '中文',
      languageCode: 'zh',
      createdAt: '2024-01-15T10:00:00Z',
      isActive: true,
      videoType: 'local',
      qualities: {
        '480p': '/videos/zh/sim-overview-480p.mp4',
        '720p': '/videos/zh/sim-overview-720p.mp4',
        '1080p': '/videos/zh/sim-overview-1080p.mp4'
      }
    }
  ],
  'ru': [
    {
      id: '3',
      title: 'The SIM - Полный обзор платформы',
      description: 'Узнайте, как работает наша платформа и как она может помочь вам инвестировать',
      youtubeUrl: '/videos/ru/sim-overview-720p.mp4', // 720p как основное
      thumbnail: '/videos/ru/sim-overview-480p.mp4', // Используем 480p для превью
      duration: '2:25',
      quality: 'HD',
      language: 'Русский',
      languageCode: 'ru',
      createdAt: '2024-01-15T10:00:00Z',
      isActive: true,
      videoType: 'local',
      qualities: {
        '480p': '/videos/ru/sim-overview-480p.mp4',
        '720p': '/videos/ru/sim-overview-720p.mp4',
        '1080p': '/videos/ru/sim-overview-1080p.mp4'
      }
    }
  ],
  'th': [
    {
      id: '4',
      title: 'The SIM - ภาพรวมแพลตฟอร์มที่สมบูรณ์',
      description: 'เรียนรู้ว่าแพลตฟอร์มของเราทำงานอย่างไรและช่วยให้คุณลงทุนได้อย่างปลอดภัย',
      youtubeUrl: '/videos/th/sim-overview-720p.mp4', // 720p как основное
      thumbnail: '/videos/th/sim-overview-480p.mp4', // Используем 480p для превью
      duration: '2:25',
      quality: 'HD',
      language: 'ไทย',
      languageCode: 'th',
      createdAt: '2024-01-15T10:00:00Z',
      isActive: true,
      videoType: 'local',
      qualities: {
        '480p': '/videos/th/sim-overview-480p.mp4',
        '720p': '/videos/th/sim-overview-720p.mp4',
        '1080p': '/videos/th/sim-overview-1080p.mp4'
      }
    }
  ]
}

// Функция для получения видео по языку
export const getVideosByLanguage = (languageCode: string): VideoData[] => {
  return videoData[languageCode] || []
}

// Функция для получения видео определенного качества
export const getVideoByQuality = (languageCode: string, quality: '480p' | '720p' | '1080p'): string | null => {
  const videos = videoData[languageCode]
  if (videos && videos.length > 0) {
    return videos[0].qualities[quality] || null
  }
  return null
}
