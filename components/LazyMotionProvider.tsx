'use client'

import { LazyMotion, domAnimation, m } from 'framer-motion'
import { ReactNode } from 'react'

/**
 * LazyMotion Provider для оптимизации framer-motion
 * Загружает только необходимые анимации, уменьшая bundle size
 */
export default function LazyMotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation}>
      {children}
    </LazyMotion>
  )
}

// Экспортируем m компонент для использования в дочерних компонентах
export { m }

