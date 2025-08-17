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
      youtubeUrl: 'https://youtu.be/ka0nK332FK0', // 720p как основное
      thumbnail: 'https://img.youtube.com/vi/ka0nK332FK0/maxresdefault.jpg',
      duration: '2:25',
      quality: 'HD',
      language: 'English',
      languageCode: 'en',
      createdAt: '2024-01-15T10:00:00Z',
      isActive: true,
      videoType: 'youtube',
      qualities: {
        '480p': 'https://youtu.be/-_2d4MXUv6s',
        '720p': 'https://youtu.be/ka0nK332FK0',
        '1080p': 'https://youtu.be/fnfXCAAHoeI'
      }
    }
  ],
  'zh': [
    {
      id: '2',
      title: 'The SIM - 完整平台概述',
      description: '了解我们平台如何工作以及如何帮助您安全投资',
      youtubeUrl: 'https://youtu.be/xn8oJKSfkoI', // 720p как основное
      thumbnail: 'https://img.youtube.com/vi/xn8oJKSfkoI/maxresdefault.jpg',
      duration: '2:25',
      quality: '高清',
      language: '中文',
      languageCode: 'zh',
      createdAt: '2024-01-15T10:00:00Z',
      isActive: true,
      videoType: 'youtube',
      qualities: {
        '480p': 'https://youtu.be/UC0BVkFw0jk',
        '720p': 'https://youtu.be/xn8oJKSfkoI',
        '1080p': 'https://youtu.be/DZ1JyVltuBk'
      }
    }
  ],
  'ru': [
    {
      id: '3',
      title: 'The SIM - Полный обзор платформы',
      description: 'Узнайте, как работает наша платформа и как она может помочь вам инвестировать',
      youtubeUrl: 'https://youtu.be/i6aw3SWLuas', // 720p как основное
      thumbnail: 'https://img.youtube.com/vi/i6aw3SWLuas/maxresdefault.jpg',
      duration: '2:25',
      quality: 'HD',
      language: 'Русский',
      languageCode: 'ru',
      createdAt: '2024-01-15T10:00:00Z',
      isActive: true,
      videoType: 'youtube',
      qualities: {
        '480p': 'https://youtu.be/xMGfh8DGFgo',
        '720p': 'https://youtu.be/i6aw3SWLuas',
        '1080p': 'https://youtu.be/3cmR6nTboHc'
      }
    }
  ],
  'th': [
    {
      id: '4',
      title: 'The SIM - ภาพรวมแพลตฟอร์มที่สมบูรณ์',
      description: 'เรียนรู้ว่าแพลตฟอร์มของเราทำงานอย่างไรและช่วยให้คุณลงทุนได้อย่างปลอดภัย',
      youtubeUrl: 'https://youtu.be/JfRbF5HBL_U', // 720p как основное
      thumbnail: 'https://img.youtube.com/vi/JfRbF5HBL_U/maxresdefault.jpg',
      duration: '2:25',
      quality: 'HD',
      language: 'ไทย',
      languageCode: 'th',
      createdAt: '2024-01-15T10:00:00Z',
      isActive: true,
      videoType: 'youtube',
      qualities: {
        '480p': 'https://youtu.be/wOVEa4_84zo',
        '720p': 'https://youtu.be/JfRbF5HBL_U',
        '1080p': 'https://youtu.be/VU_X5qHBHa8'
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
