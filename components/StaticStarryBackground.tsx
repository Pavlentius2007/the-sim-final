'use client'

import React from 'react'

interface StaticStarryBackgroundProps {
  className?: string
}

export default function StaticStarryBackground({ 
  className = '' 
}: StaticStarryBackgroundProps) {
  return (
    <div
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{
        backgroundImage: 'url(/fon.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    />
  )
}
