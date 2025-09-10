'use client'

import dynamic from 'next/dynamic'
import { ComponentType } from 'react'

// Loading компонент для показа во время загрузки
const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-20">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
  </div>
)

const LoadingBox = ({ height = "h-64" }: { height?: string }) => (
  <div className={`animate-pulse bg-dark-700 ${height} rounded-xl loading-skeleton`}></div>
)

// Dynamic импорты для оптимизации - отключаем SSR для стабильности
export const DynamicVideo = dynamic(() => import('./Video'), {
  loading: () => <LoadingBox height="h-96" />,
  ssr: false
})

export const DynamicHero = dynamic(() => import('./Hero'), {
  loading: () => <LoadingBox height="h-screen" />,
  ssr: false
})

export const DynamicTestimonials = dynamic(() => import('./Testimonials'), {
  loading: () => <LoadingBox height="h-80" />,
  ssr: false
})

export const DynamicFAQ = dynamic(() => import('./FAQ'), {
  loading: () => <LoadingBox height="h-96" />,
  ssr: false
})

export const DynamicContactForm = dynamic(() => import('./ContactForm'), {
  loading: () => <LoadingBox height="h-96" />,
  ssr: false
})

// Lazy загрузка анимированных компонентов
export const DynamicBenefits = dynamic(() => import('./Benefits'), {
  loading: () => <LoadingBox height="h-screen" />,
  ssr: false
})

export const DynamicInvestment = dynamic(() => import('./Investment'), {
  loading: () => <LoadingBox height="h-80" />,
  ssr: false
})

export const DynamicAbout = dynamic(() => import('./About'), {
  loading: () => <LoadingBox height="h-96" />,
  ssr: false
})

