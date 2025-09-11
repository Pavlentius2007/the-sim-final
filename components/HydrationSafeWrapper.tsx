'use client'

import React from 'react'

interface HydrationSafeWrapperProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

/**
 * Простая обертка для предотвращения ошибок гидратации
 */
export default function HydrationSafeWrapper({ children, fallback: _fallback = null }: HydrationSafeWrapperProps) {
  return <div suppressHydrationWarning>{children}</div>
}
