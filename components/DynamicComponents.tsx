'use client'

import dynamic from 'next/dynamic'

const LoadingBox = ({ height = "h-64" }: { height?: string }) => (
  <div className={`animate-pulse bg-dark-700 ${height} rounded-xl loading-skeleton`}></div>
)

// Dynamic импорты для оптимизации - отключаем SSR для стабильности
export const DynamicVideo = dynamic(() => import('./Video'), { 
  ssr: false,
  loading: () => <LoadingBox height="h-96" />
})

export const DynamicHero = dynamic(() => import('./Hero'), {
  ssr: false,
  loading: () => <LoadingBox height="h-screen" />
})

export const DynamicTestimonials = dynamic(() => import('./Testimonials'), {
  ssr: false,
  loading: () => <LoadingBox height="h-96" />
})

export const DynamicFAQ = dynamic(() => import('./FAQ'), {
  ssr: false,
  loading: () => <LoadingBox height="h-96" />
})

export const DynamicContactForm = dynamic(() => import('./ContactForm'), {
  ssr: false,
  loading: () => <LoadingBox height="h-96" />
})

export const DynamicBenefits = dynamic(() => import('./Benefits'), {
  ssr: false,
  loading: () => <LoadingBox height="h-96" />
})

export const DynamicInvestment = dynamic(() => import('./Investment'), {
  ssr: false,
  loading: () => <LoadingBox height="h-96" />
})

export const DynamicAbout = dynamic(() => import('./About'), {
  ssr: false,
  loading: () => <LoadingBox height="h-96" />
})
