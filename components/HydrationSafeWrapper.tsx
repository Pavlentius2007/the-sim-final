'use client'

import { useEffect, useState } from 'react'

interface HydrationSafeWrapperProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

/**
 * Обертка для предотвращения ошибок гидратации
 * Рендерит fallback на сервере, children только на клиенте
 */
export default function HydrationSafeWrapper({ children, fallback = null }: HydrationSafeWrapperProps) {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  if (!isHydrated) {
    return <div suppressHydrationWarning>{fallback}</div>
  }

  return <div suppressHydrationWarning>{children}</div>
}
