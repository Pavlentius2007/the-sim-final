'use client'

import { useEffect, useState } from 'react'

interface CSSStarryBackgroundProps {
  className?: string
  starCount?: number
  intensity?: 'low' | 'medium' | 'high'
}

export default function CSSStarryBackground({
  className = '',
  starCount = 200,
  intensity = 'medium'
}: CSSStarryBackgroundProps) {
  const [stars, setStars] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number }>>([])

  useEffect(() => {
    const intensitySettings = {
      low: { starCount: 150, baseSize: 1 },
      medium: { starCount: 200, baseSize: 1.5 },
      high: { starCount: 300, baseSize: 2 }
    }

    const settings = intensitySettings[intensity]
    const newStars = Array.from({ length: settings.starCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * settings.baseSize + 0.5,
      delay: Math.random() * 3
    }))

    setStars(newStars)
  }, [starCount, intensity])

  return (
    <div className={`fixed inset-0 pointer-events-none z-0 overflow-hidden ${className}`}>
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.delay}s`,
            animationDuration: `${3 + Math.random() * 2}s`
          }}
        />
      ))}
      
      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
