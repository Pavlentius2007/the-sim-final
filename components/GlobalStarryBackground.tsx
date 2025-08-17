'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

interface Star {
  x: number
  y: number
  size: number
  speed: number
  opacity: number
  twinkle: number
  twinkleSpeed: number
  layer: number // Слой для глубины
}

interface GlobalStarryBackgroundProps {
  className?: string
  starCount?: number
  baseSpeed?: number
  scrollSensitivity?: number
  intensity?: 'low' | 'medium' | 'high'
}

export default function GlobalStarryBackground({
  className = '',
  starCount: _starCount = 500, // Увеличили количество
  baseSpeed: _baseSpeed = 0.15, // Немного замедлили для производительности
  scrollSensitivity: _scrollSensitivity = 1, // Уменьшили чувствительность
  intensity = 'high' // По умолчанию высокое качество
}: GlobalStarryBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const starsRef = useRef<Star[]>([])
  const scrollRef = useRef(0)
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
  const lastFrameTime = useRef(0)
  const targetFPS = 60
  const frameInterval = 1000 / targetFPS

  // Настройки интенсивности с оптимизацией
  const intensitySettings = {
    low: { starCount: 300, baseSpeed: 0.1, scrollSensitivity: 0.5 },
    medium: { starCount: 500, baseSpeed: 0.15, scrollSensitivity: 1 },
    high: { starCount: 800, baseSpeed: 0.2, scrollSensitivity: 1.5 }
  }

  const settings = intensitySettings[intensity]

  // Инициализация размера окна с throttling
  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout
    
    const updateWindowSize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        setWindowSize({
          width: window.innerWidth,
          height: Math.max(
            window.innerHeight,
            document.documentElement.scrollHeight,
            document.body.scrollHeight
          )
        })
      }, 100) // Throttle resize events
    }

    updateWindowSize()
    window.addEventListener('resize', updateWindowSize)
    window.addEventListener('scroll', updateWindowSize)
    
    return () => {
      window.removeEventListener('resize', updateWindowSize)
      window.removeEventListener('scroll', updateWindowSize)
      clearTimeout(resizeTimeout)
    }
  }, [])

  // Инициализация звезд с слоями
  useEffect(() => {
    if (!windowSize.width || !windowSize.height) return

    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = windowSize.width
    canvas.height = windowSize.height

    // Создаем звезды по всей высоте с разными слоями
    starsRef.current = Array.from({ length: settings.starCount }, () => ({
      x: Math.random() * windowSize.width,
      y: Math.random() * windowSize.height,
      size: Math.random() * 2.5 + 0.3, // Увеличили размер
      speed: Math.random() * settings.baseSpeed + 0.05,
      opacity: Math.random() * 0.9 + 0.1,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.015 + 0.005,
      layer: Math.floor(Math.random() * 3) // 3 слоя глубины
    }))
  }, [windowSize.width, windowSize.height, settings.starCount, settings.baseSpeed])

  // Обработчик скролла с throttling
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout

    const handleScroll = () => {
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        scrollRef.current = window.scrollY
      }, 16)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimeout)
    }
  }, [])

  // Оптимизированная анимация звезд с FPS контролем
  const animateStars = useCallback((currentTime: number) => {
    if (currentTime - lastFrameTime.current < frameInterval) {
      animationRef.current = requestAnimationFrame(animateStars)
      return
    }
    
    lastFrameTime.current = currentTime

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Очищаем canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Обновляем и рисуем звезды по слоям
    for (let layer = 0; layer < 3; layer++) {
      starsRef.current
        .filter(star => star.layer === layer)
        .forEach((star) => {
          // Проверяем валидность координат
          if (!isFinite(star.x) || !isFinite(star.y) || isNaN(star.x) || isNaN(star.y)) {
            star.x = Math.random() * canvas.width
            star.y = Math.random() * canvas.height
            star.speed = Math.random() * settings.baseSpeed + 0.05
            return
          }

          // Влияние скролла (только для дальних звезд)
          const scrollInfluence = Math.min(scrollRef.current / 1500, 1)
          const scrollOffsetY = scrollInfluence * settings.scrollSensitivity * (layer + 1) * 0.5

          // Обновляем позицию звезды
          star.x += star.speed
          star.y += star.speed * 0.3 + scrollOffsetY

          // Обновляем мерцание
          star.twinkle += star.twinkleSpeed
          const twinkleOpacity = Math.sin(star.twinkle) * 0.4 + 0.6

          // Возвращаем звезду в начало если она вышла за границы
          if (star.x > canvas.width + 20) star.x = -20
          if (star.y > canvas.height + 20) star.y = -20
          if (star.x < -20) star.x = canvas.width + 20
          if (star.y < -20) star.y = canvas.height + 20

          // Рисуем звезду с учетом слоя
          ctx.save()
          ctx.globalAlpha = star.opacity * twinkleOpacity * (0.7 + layer * 0.15)
          
          try {
            // Создаем свечение для звезды
            const starGradient = ctx.createRadialGradient(
              star.x, star.y, 0,
              star.x, star.y, star.size * (2 + layer)
            )
            starGradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
            starGradient.addColorStop(0.3, 'rgba(173, 216, 230, 0.8)')
            starGradient.addColorStop(0.7, 'rgba(100, 149, 237, 0.4)')
            starGradient.addColorStop(1, 'rgba(70, 130, 180, 0)')
            
            ctx.fillStyle = starGradient
            ctx.beginPath()
            ctx.arc(star.x, star.y, star.size * (2 + layer), 0, Math.PI * 2)
            ctx.fill()
          } catch {
            // Ошибка при создании звезд, продолжаем без них
          }

          // Рисуем центр звезды
          ctx.fillStyle = 'rgba(255, 255, 255, 1)'
          ctx.beginPath()
          ctx.arc(star.x, star.y, star.size * 0.6, 0, Math.PI * 2)
          ctx.fill()

          ctx.restore()
        })
    }

    animationRef.current = requestAnimationFrame(animateStars)
  }, [settings.baseSpeed, settings.scrollSensitivity, frameInterval])

  // Запуск анимации
  useEffect(() => {
    if (windowSize.width && windowSize.height) {
      animateStars(performance.now())
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [animateStars, windowSize.width, windowSize.height])

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-10 ${className}`}
      style={{
        background: 'transparent',
        width: '100vw',
        height: `${windowSize.height}px`
      }}
    />
  )
}
